import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chat";
import { QUERY_KEYS } from "@/lib/react-query/config";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useAppStore } from "@/stores/useAppStore";
import type {
  MessageWithSender,
  SendTextMessageRequest,
  SendMediaMessageRequest,
  MessageType,
} from "@/types/ChatTypes";
import { getUserAvatar, getUserLastName, getUserName } from "@/services/auth/auth.types";

interface SendMessagePayload {
  conversacionId: number;
  tipo: MessageType;
  contenido?: string;
  mediaId?: number;
  caption?: string;
}

/**
 * Hook para enviar mensajes con optimistic updates
 * Actualiza la UI inmediatamente y sincroniza con el servidor
 * 
 * @returns Mutation result con función sendMessage
 * 
 * @example
 * const { sendMessage, isLoading } = useSendMessage();
 * sendMessage({ conversacionId: 123, tipo: 'texto', contenido: 'Hola' });
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const setToast = useGlobalUIStore((state) => state.setToast);
  const user = useAppStore((state) => state.user);

  const mutation = useMutation<MessageWithSender, Error, SendMessagePayload>({
    mutationFn: async (payload: SendMessagePayload) => {
      const { conversacionId, tipo, contenido, mediaId } = payload;

      // The backend may return either the raw MessageWithSender or an envelope
      // { mensaje, data: MessageWithSender, esPropio, remitente }
      let responseRaw: any;
      let message: MessageWithSender;

      // Enviar mensaje de texto
      if (tipo === "texto") {
        if (!contenido) {
          throw new Error("Payload inválido: mensaje de texto requiere 'contenido'");
        }
        const request: SendTextMessageRequest = {
          conversacionId,
          contenido,
        };
        responseRaw = await chatService.sendTextMessage(request);
      } else {
        // Enviar mensaje de media (audio, imagen, video, archivo)
        // Los mensajes de media no requieren 'contenido' ni 'caption', pero sí requieren 'mediaId'.
        if (typeof mediaId !== "number") {
          throw new Error("Payload inválido: los mensajes de tipo media requieren 'mediaId'");
        }

        const mediaRequest: SendMediaMessageRequest = {
          conversacionId,
          mediaId,
          contenido, // Opcional para mensajes de media
          tipo,
        };
        responseRaw = await chatService.sendMediaMessage(mediaRequest);
      }
      // Normalize response: if backend returned an envelope, extract .data
      if (responseRaw && typeof responseRaw === 'object' && responseRaw.data && typeof responseRaw.data.id === 'number') {
        message = responseRaw.data as MessageWithSender;
        // If the envelope includes esPropio or remitente at top-level, merge them
        if (responseRaw.esPropio !== undefined) message.esPropio = responseRaw.esPropio;
        if (responseRaw.remitente) message.remitente = responseRaw.remitente;
      } else {
        message = responseRaw as MessageWithSender;
      }

      // Enriquecer mensaje con datos del usuario actual si faltan
      if (!message.remitente || !message.remitente.nombre) {
        console.warn("[useSendMessage] Respuesta del servidor sin datos del remitente, enriqueciendo con datos del usuario actual");
        message.remitente = {
          id: user?.id || 0,
          nombre: getUserName(user) || "Usuario",
          apellido: getUserLastName(user) || "",
          fotoPerfil: getUserAvatar(user) || "",
        };
      }

      // Asegurar esPropio
      message.esPropio = message.esPropio !== undefined ? message.esPropio : (message.remitente?.id === user?.id);

      return message;
    },

    onMutate: async (variables) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MESSAGES(variables.conversacionId),
      });

      // Snapshot del estado anterior
      const previousMessages = queryClient.getQueryData(
        QUERY_KEYS.MESSAGES(variables.conversacionId)
      );

      // Crear ID temporal único usando número negativo para evitar conflictos
      const tempId = -Date.now();

      // Crear mensaje temporal (optimistic update)
      const tempMessage: MessageWithSender = {
        id: tempId,
        conversacionId: variables.conversacionId,
        remitenteId: user?.id || 0,
        contenido: variables.contenido,
        tipo: variables.tipo,
        mediaId: variables.mediaId || null,
        media: undefined, // Se llenará cuando llegue la respuesta del servidor
        estado: "Enviado",
        enviadoEn: new Date().toISOString(),
        leido: false,
        eliminado: false,
        remitente: {
          id: user?.id || 0,
          nombre: getUserName(user) || "Usuario",
          apellido: getUserLastName(user) || "",
          fotoPerfil: getUserAvatar(user) || "",
        },
        esPropio: true,
      };

      // Actualizar query optimísticamente
      queryClient.setQueryData(
        QUERY_KEYS.MESSAGES(variables.conversacionId),
        (old: any) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: [
              {
                mensajes: [tempMessage, ...old.pages[0].mensajes],
                tieneMas: old.pages[0].tieneMas,
                siguienteCursor: old.pages[0].siguienteCursor,
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );

      // Retornar contexto para rollback y para reemplazar el mensaje temporal
      return { previousMessages, tempId };
    },

    onSuccess: (data, variables, context: any) => {
      // `data` is normalized MessageWithSender from mutationFn
      const msg: MessageWithSender = data;

      // Ensure esPropio flag
      const messageWithEsPropio = {
        ...msg,
        esPropio: msg.esPropio !== undefined ? msg.esPropio : msg.remitente?.id === user?.id,
      };

      // Replace optimistic message with real one
      queryClient.setQueryData(
        QUERY_KEYS.MESSAGES(variables.conversacionId),
        (old: any) => {
          if (!old?.pages) return old;

          const updatedPages = old.pages.map((page: any, pageIndex: number) => {
            if (pageIndex === 0) {
              // Check if message already exists (arrived via WebSocket)
              const messageExists = page.mensajes.some(
                (msgItem: MessageWithSender) => msgItem.id === messageWithEsPropio.id,
              );

              if (messageExists) {
                return {
                  ...page,
                  mensajes: page.mensajes.filter(
                    (m: MessageWithSender) => m.id !== context?.tempId,
                  ),
                };
              }

              const tempMessage = page.mensajes.find(
                (m: MessageWithSender) => m.id === context?.tempId,
              );

              const filteredMessages = page.mensajes.filter(
                (m: MessageWithSender) => m.id !== context?.tempId,
              );

              const mergedMessage: MessageWithSender = {
                ...messageWithEsPropio,
                remitente: messageWithEsPropio.remitente?.nombre
                  ? messageWithEsPropio.remitente
                  : tempMessage?.remitente,
                enviadoEn: messageWithEsPropio.enviadoEn || tempMessage?.enviadoEn,
              } as MessageWithSender;

              return {
                ...page,
                mensajes: [mergedMessage, ...filteredMessages],
              };
            }
            return page;
          });

          return {
            ...old,
            pages: updatedPages,
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS });

    },

    onError: (error, variables, context: any) => {
      // Rollback en caso de error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          QUERY_KEYS.MESSAGES(variables.conversacionId),
          context.previousMessages
        );
      }

      console.error("[useSendMessage] Error:", error);
      
      setToast({
        message: "Error al enviar mensaje. Intenta nuevamente.",
        type: "error",
        open: true,
      });
    },
  });

  return {
    sendMessage: mutation.mutate,
    sendMessageAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useSendMessage;
