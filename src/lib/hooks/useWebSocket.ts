import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/websocket";
import { chatService } from "@/services/chat";
import { useAppStore } from "@/stores/useAppStore";
import { QUERY_KEYS } from "@/lib/react-query/config";
import type {
  NuevoMensajeEvent,
  MensajeEditadoEvent,
  MensajeEliminadoEvent,
  NuevaConversacionEvent,
  ConversacionActualizadaEvent,
  ContadorNoLeidosConversacionEvent,
  UsuarioEscribiendoRecibidoEvent,
  UsuarioDejoEscribirRecibidoEvent,
  UsuarioConectadoEvent,
  UsuarioDesconectadoEvent,
  EstadoConexionUsuariosEvent,
} from "@/types/WebSocketTypes";
import { getUserFullName, getUserName, getUserLastName, getUserAvatar } from "@/services/auth/auth.types";

// ============================================
// MODULE-LEVEL SINGLETON STATE
// Ensures only one WebSocket connection + listener set exists regardless of
// how many components call useWebSocket().
// ============================================
let instanceCount = 0;
let listenerCleanup: (() => void) | null = null;
let statusCleanup: (() => void) | null = null;
const typingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Hook personalizado para manejo de WebSocket en el chat
 * Conecta, registra listeners y sincroniza con React Query y Zustand
 * 
 * Uses module-level ref counting so that the socket lifecycle is shared
 * across all component instances that call this hook.  Only the first
 * mount creates the connection & listeners; only the last unmount tears
 * them down.
 * 
 * @returns Métodos para interactuar con WebSocket
 */
export const useWebSocket = () => {
  const queryClient = useQueryClient();

  // Store selectors
  const accessToken = useAppStore((state) => state.accessToken);
  const user = useAppStore((state) => state.user);
  const setConnectionStatus = useAppStore((state) => state.setConnectionStatus);
  const addMessage = useAppStore((state) => state.addMessage);
  const updateMessage = useAppStore((state) => state.updateMessage);
  const removeMessage = useAppStore((state) => state.removeMessage);
  const addConversation = useAppStore((state) => state.addConversation);
  const updateConversation = useAppStore((state) => state.updateConversation);
  const updateUnreadCount = useAppStore((state) => state.updateUnreadCount);
  const setTypingUser = useAppStore((state) => state.setTypingUser);
  const removeTypingUser = useAppStore((state) => state.removeTypingUser);
  const setUserOnline = useAppStore((state) => state.setUserOnline);
  const setUserOffline = useAppStore((state) => state.setUserOffline);

  // ============================================
  // SETUP LISTENERS
  // ============================================

  const setupListeners = useCallback(() => {
    // Nuevo mensaje recibido
    const unsubNewMessage = socketService.onNewMessage(
      (event: NuevoMensajeEvent) => {
        console.log("[useWebSocket] Nuevo mensaje recibido:", event);

        // Ensure esPropio field is correctly set
        // If backend doesn't provide it, calculate it based on current user
        let messageWithEsPropio = {
          ...event,
          esPropio: event.esPropio !== undefined 
            ? event.esPropio 
            : event.remitenteId === user?.id,
        };

        // Enriquecer mensaje con datos del usuario actual si es mensaje propio y faltan datos
        if (messageWithEsPropio.esPropio && (!messageWithEsPropio.remitente || !messageWithEsPropio.remitente.nombre)) {
          console.warn("[useWebSocket] Mensaje propio sin datos del remitente, enriqueciendo con datos del usuario actual");
          messageWithEsPropio.remitente = {
            id: user?.id || 0,
            nombre: getUserName(user) || "Usuario",
            apellido: getUserLastName(user) || "",
            fotoPerfil: getUserAvatar(user) || "",
          };
        }

        // Actualizar query de mensajes
        queryClient.setQueryData(
          QUERY_KEYS.MESSAGES(event.conversacionId),
          (old: any) => {
            if (!old?.pages) return old;

            // Verificar si el mensaje ya existe (evitar duplicados)
            const exists = old.pages[0]?.mensajes.some(
              (m: any) => m.id === event.id
            );
            if (exists) {
              console.log(`[useWebSocket] Mensaje ${event.id} ya existe, ignorando duplicado`);
              return old;
            }

            // Si el mensaje es propio, buscar y reemplazar mensaje optimista
            if (messageWithEsPropio.esPropio) {
              const firstPage = old.pages[0];
              // Buscar mensaje optimista reciente (ID negativo) del mismo tipo
              const optimisticIndex = firstPage.mensajes.findIndex(
                (m: any) => 
                  m.id < 0 && 
                  m.remitenteId === event.remitenteId &&
                  m.tipo === event.tipo &&
                  // Verificar que sea reciente (últimos 10 segundos)
                  (Date.now() - new Date(m.enviadoEn).getTime() < 10000)
              );

              if (optimisticIndex !== -1) {
                console.log(`[useWebSocket] Reemplazando mensaje optimista ${firstPage.mensajes[optimisticIndex].id} con mensaje real ${event.id}`);
                // Hacer merge del mensaje optimista con el real, preservando datos del usuario
                const optimisticMessage = firstPage.mensajes[optimisticIndex];
                const updatedMessages = [...firstPage.mensajes];
                
                // Merge inteligente: usar datos del servidor pero preservar datos críticos si no vienen
                updatedMessages[optimisticIndex] = {
                  ...messageWithEsPropio,
                  // Preservar remitente del optimista si el del servidor no tiene nombre
                  remitente: messageWithEsPropio.remitente?.nombre 
                    ? messageWithEsPropio.remitente 
                    : optimisticMessage.remitente,
                  // Preservar fecha si la del servidor es inválida
                  enviadoEn: messageWithEsPropio.enviadoEn || optimisticMessage.enviadoEn,
                };
                
                return {
                  ...old,
                  pages: [
                    {
                      ...firstPage,
                      mensajes: updatedMessages,
                    },
                    ...old.pages.slice(1),
                  ],
                };
              }
            }

            // Si no hay mensaje optimista, agregar normalmente
            return {
              ...old,
              pages: [
                {
                  mensajes: [messageWithEsPropio, ...old.pages[0].mensajes],
                  tieneMas: old.pages[0].tieneMas,
                  siguienteCursor: old.pages[0].siguienteCursor,
                },
                ...old.pages.slice(1),
              ],
            };
          }
        );

        // Actualizar store
        addMessage(event.conversacionId, messageWithEsPropio);

        // Invalidar conversaciones para actualizar último mensaje
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.CONVERSATIONS,
        });
      }
    );

    // Mensaje editado
    const unsubMessageEdited = socketService.onMessageEdited(
      (event: MensajeEditadoEvent) => {
        console.log("[useWebSocket] Mensaje editado:", event);

        // Actualizar query de mensajes
        queryClient.setQueryData(
          QUERY_KEYS.MESSAGES(event.conversacionId),
          (old: any) => {
            if (!old?.pages) return old;

            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                mensajes: page.mensajes.map((m: any) =>
                  m.id === event.id ? event : m
                ),
              })),
            };
          }
        );

        // Actualizar store
        updateMessage(event.conversacionId, event.id, event);
      }
    );

    // Mensaje eliminado
    const unsubMessageDeleted = socketService.onMessageDeleted(
      (event: MensajeEliminadoEvent) => {
        console.log("[useWebSocket] Mensaje eliminado:", event);

        const { conversacionId, mensajeId } = event;

        // Actualizar query de mensajes
        queryClient.setQueryData(
          QUERY_KEYS.MESSAGES(conversacionId),
          (old: any) => {
            if (!old?.pages) return old;

            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                mensajes: page.mensajes.filter((m: any) => m.id !== mensajeId),
              })),
            };
          }
        );

        // Actualizar store
        removeMessage(conversacionId, mensajeId);
      }
    );

    // Nueva conversación
    const unsubNewConversation = socketService.onNewConversation(
      (event: NuevaConversacionEvent) => {
        console.log("[useWebSocket] Nueva conversación:", event);

        const { conversacion } = event;

        // Actualizar store
        addConversation(conversacion);

        // Invalidar query de conversaciones
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.CONVERSATIONS,
        });
      }
    );

    // Conversación actualizada
    const unsubConversationUpdated = socketService.onConversationUpdated(
      (event: ConversacionActualizadaEvent) => {
        console.log("[useWebSocket] Conversación actualizada:", event);

        const { conversacion } = event;

        // Actualizar store
        updateConversation(conversacion.id, conversacion);

        // Invalidar query de conversaciones
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.CONVERSATIONS,
        });
      }
    );

    // Contador de no leídos actualizado
    const unsubUnreadCount = socketService.onUnreadCountUpdate(
      (event: ContadorNoLeidosConversacionEvent) => {
        console.log("[useWebSocket] Contador no leídos:", event);

        const { conversacionId, contador } = event;

        // Actualizar store
        updateUnreadCount(conversacionId, contador);

        // Also update the React Query cache for conversations so UI lists
        // that read from the query (e.g. ChatSidebar) reflect the change
        try {
          queryClient.setQueryData(QUERY_KEYS.CONVERSATIONS, (old: any) => {
            if (!old) return old;

            // old may be an array of conversations
            if (Array.isArray(old)) {
              return old.map((conv: any) =>
                conv.id === conversacionId ? { ...conv, mensajesNoLeidos: contador } : conv
              );
            }

            return old;
          });
        } catch (err) {
          console.error("[useWebSocket] Error updating conversations cache:", err);
        }
      }
    );

    // Usuario escribiendo
    const unsubUserTyping = socketService.onUserTyping(
      (event: UsuarioEscribiendoRecibidoEvent) => {
        console.log("[useWebSocket] Usuario escribiendo:", event);

        const { conversacionId, usuarioId, nombre } = event;

        // Actualizar store
        setTypingUser(conversacionId, {
          usuarioId,
          nombre,
          conversacionId,
          timestamp: Date.now(),
        });

        // Clear previous timeout for this user before scheduling a new one.
        // This prevents the indicator from disappearing while the user is still typing.
        const key = `${conversacionId}-${usuarioId}`;
        const existing = typingTimeouts.get(key);
        if (existing) clearTimeout(existing);

        const timeout = setTimeout(() => {
          removeTypingUser(conversacionId, usuarioId);
          typingTimeouts.delete(key);
        }, 5000);
        typingTimeouts.set(key, timeout);
      }
    );

    // Usuario dejó de escribir
    const unsubUserStopTyping = socketService.onUserStopTyping(
      (event: UsuarioDejoEscribirRecibidoEvent) => {
        console.log("[useWebSocket] Usuario dejó de escribir:", event);

        const { conversacionId, usuarioId } = event;

        // Actualizar store
        removeTypingUser(conversacionId, usuarioId);
      }
    );

    // Usuario conectado
    const unsubUserConnected = socketService.onUserConnected(
      (event: UsuarioConectadoEvent) => {
        console.log("[useWebSocket] Usuario conectado:", event);

        const { usuarioId } = event;

        // Actualizar store
        setUserOnline(usuarioId);

        // Actualizar query de conversaciones
        queryClient.setQueryData(QUERY_KEYS.CONVERSATIONS, (old: any) => {
          if (!old) return old;

          if (Array.isArray(old)) {
            return old.map((conv: any) =>
              conv.otroUsuario?.id === usuarioId
                ? {
                    ...conv,
                    otroUsuario: { ...conv.otroUsuario, conectado: true },
                  }
                : conv
            );
          }

          return old;
        });
      }
    );

    // Usuario desconectado
    const unsubUserDisconnected = socketService.onUserDisconnected(
      (event: UsuarioDesconectadoEvent) => {
        console.log("[useWebSocket] Usuario desconectado:", event);

        const { usuarioId } = event;

        // Actualizar store
        setUserOffline(usuarioId);

        // Actualizar query de conversaciones
        queryClient.setQueryData(QUERY_KEYS.CONVERSATIONS, (old: any) => {
          if (!old) return old;

          if (Array.isArray(old)) {
            return old.map((conv: any) =>
              conv.otroUsuario?.id === usuarioId
                ? {
                    ...conv,
                    otroUsuario: { ...conv.otroUsuario, conectado: false },
                  }
                : conv
            );
          }

          return old;
        });
      }
    );

    // Estado de conexión de usuarios (respuesta a solicitud)
    const unsubConnectionStatus = socketService.onConnectionStatusResponse(
      (event: EstadoConexionUsuariosEvent) => {
        console.log("[useWebSocket] Estado de conexión recibido:", event);

        const { estados } = event;

        // Actualizar store para cada usuario
        Object.entries(estados).forEach(([userIdStr, isOnline]) => {
          const userId = parseInt(userIdStr, 10);
          if (isOnline) {
            setUserOnline(userId);
          } else {
            setUserOffline(userId);
          }
        });

        // Actualizar query de conversaciones
        queryClient.setQueryData(QUERY_KEYS.CONVERSATIONS, (old: any) => {
          if (!old) return old;

          if (Array.isArray(old)) {
            return old.map((conv: any) => {
              const otroUsuarioId = conv.otroUsuario?.id;
              if (otroUsuarioId && estados[otroUsuarioId] !== undefined) {
                return {
                  ...conv,
                  otroUsuario: { 
                    ...conv.otroUsuario, 
                    conectado: estados[otroUsuarioId] 
                  },
                };
              }
              return conv;
            });
          }

          return old;
        });

        console.log(`[useWebSocket] Estados actualizados: ${Object.keys(estados).length} usuarios`);
      }
    );

    // Retornar función de cleanup
    return () => {
      unsubNewMessage();
      unsubMessageEdited();
      unsubMessageDeleted();
      unsubNewConversation();
      unsubConversationUpdated();
      unsubUnreadCount();
      unsubUserTyping();
      unsubUserStopTyping();
      unsubUserConnected();
      unsubUserDisconnected();
      unsubConnectionStatus();
    };
  }, [
    queryClient,
    addMessage,
    updateMessage,
    removeMessage,
    addConversation,
    updateConversation,
    updateUnreadCount,
    setTypingUser,
    removeTypingUser,
    setUserOnline,
    setUserOffline,
  ]);

  // ============================================
  // CONNECTION EFFECT — ref-counted singleton
  // ============================================

  useEffect(() => {
    if (!accessToken) return;

    instanceCount++;
    console.log(`[useWebSocket] Mount (instances: ${instanceCount})`);

    // Only the FIRST instance creates the connection & listeners.
    if (instanceCount === 1) {
      console.log("[useWebSocket] Iniciando conexión WebSocket...");
      socketService.connect(accessToken);

      statusCleanup = socketService.onConnectionStatusChange((status) => {
        console.log("[useWebSocket] Estado de conexión:", status);
        setConnectionStatus(status);
        
        // Cuando se conecta exitosamente, unirse a la sala personal del usuario
        if (status === "connected" && user?.id) {
          const personalRoom = `usuario:${user.id}`;
          socketService.joinRoom(personalRoom);
          console.log(`[useWebSocket] Usuario ${user.id} se unió a su sala personal: ${personalRoom}`);
        }
      });

      listenerCleanup = setupListeners();
    }

    // Cleanup — only the LAST instance tears everything down.
    return () => {
      instanceCount--;
      console.log(`[useWebSocket] Unmount (instances: ${instanceCount})`);

      if (instanceCount === 0) {
        console.log("[useWebSocket] Última instancia — desconectando...");
        listenerCleanup?.();
        listenerCleanup = null;
        statusCleanup?.();
        statusCleanup = null;
        typingTimeouts.forEach((t) => clearTimeout(t));
        typingTimeouts.clear();
        socketService.disconnect();
      }
    };
  }, [accessToken, user, setupListeners, setConnectionStatus]);

  // ============================================
  // EXPORTED METHODS
  // ============================================

  const joinConversation = useCallback((conversacionId: number) => {
    socketService.joinConversation(conversacionId);
  }, []);

  const leaveConversation = useCallback((conversacionId: number) => {
    socketService.leaveConversation(conversacionId);
  }, []);

  const sendTypingIndicator = useCallback(
    (conversacionId: number) => {
      if (!user) {
        console.warn("[useWebSocket.sendTypingIndicator] No user found");
        return;
      }
      const nombre = getUserFullName(user);
      socketService.emitTyping(conversacionId, nombre);
    },
    [user]
  );

  const sendStopTypingIndicator = useCallback((conversacionId: number) => {
    socketService.emitStopTyping(conversacionId);
  }, []);

  const markAsRead = useCallback(
    async (conversacionId: number, ultimoMensajeLeidoId: number) => {
      if (!user) return;

      // Validate parameters before proceeding
      if (!Number.isInteger(conversacionId) || conversacionId <= 0) {
        console.error("[useWebSocket.markAsRead] Invalid conversacionId:", conversacionId);
        return;
      }

      if (!Number.isInteger(ultimoMensajeLeidoId) || ultimoMensajeLeidoId <= 0) {
        console.error("[useWebSocket.markAsRead] Invalid ultimoMensajeLeidoId:", ultimoMensajeLeidoId);
        return;
      }

      // Emitir evento por WebSocket
      socketService.emitMessagesRead({
        conversacionId,
        usuarioId: user.id,
        ultimoMensajeLeidoId,
      });

      // También llamar al REST API
      try {
        await chatService.markMessagesAsRead(conversacionId, ultimoMensajeLeidoId);
      } catch (error) {
        console.error("[useWebSocket.markAsRead] Error:", error);
      }
    },
    [user]
  );

  const requestConnectionStatus = useCallback((usuariosIds: number[]) => {
    if (usuariosIds.length === 0) return;
    socketService.requestConnectionStatus(usuariosIds);
  }, []);

  return {
    isConnected: socketService.isConnected(),
    connectionStatus: socketService.getConnectionStatus(),
    joinConversation,
    leaveConversation,
    sendTypingIndicator,
    sendStopTypingIndicator,
    markAsRead,
    requestConnectionStatus,
  };
};

export default useWebSocket;
