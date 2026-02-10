import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAppStore } from '@/stores/useAppStore';
import API_ENDPOINTS from './endpoints';

// Flag para evitar múltiples llamadas simultáneas al refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request: Agregar token automáticamente
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAppStore.getState().accessToken;
    
    // Solo agregar token si no existe ya un header Authorization
    // (para permitir tokens personalizados en peticiones específicas)
    if (accessToken && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (!accessToken && !config.headers?.Authorization) {
      console.log('📤 [API Client] Sin token - petición sin autenticación');
    }
    
    // CRÍTICO: Si estamos enviando FormData, eliminar Content-Type
    // para que axios lo configure automáticamente con el boundary correcto
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.error('📤 [API Client] Error configurando request:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response: Manejo de errores global y auto-refresh de tokens
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 [API Client] Response recibida:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      url: response.config.url
    });
    
    // Si el response es exitoso, retornar los datos directamente
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    console.error('📥 [API Client] Error en response:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    
    // Manejo de errores
    if (error.response) {
      const { status, data } = error.response;
      
      // Token expirado - intentar refresh automático
      if (status === 401 && !originalRequest._retry) {
        // Lista de endpoints de autenticación que NO deben activar el flujo de refresh
        const authEndpoints = [
          API_ENDPOINTS.AUTH.LOGIN,
          API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
          API_ENDPOINTS.AUTH.REFRESH_TOKEN,
          API_ENDPOINTS.AUTH.REGISTRO_SOLICITAR_CODIGO,
          API_ENDPOINTS.AUTH.REGISTRO_VALIDAR_CODIGO,
          API_ENDPOINTS.AUTH.REGISTRO_COMPLETAR_PACIENTE,
          API_ENDPOINTS.AUTH.REGISTRO_COMPLETAR_DOCTOR,
          API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
          API_ENDPOINTS.AUTH.RESET_PASSWORD,
          API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        ];
        
        // Si es un endpoint de autenticación, NO intentar refresh
        const isAuthEndpoint = authEndpoints.some(endpoint => 
          originalRequest.url?.includes(endpoint)
        );
        
        if (isAuthEndpoint) {
          console.log('🔓 [API Client] Error 401 en endpoint de autenticación - propagando error');
          return Promise.reject(error);
        }
        
        // Verificar si no es el endpoint de refresh para evitar loop infinito
        if (originalRequest.url === API_ENDPOINTS.AUTH.REFRESH_TOKEN) {
          console.error('🔒 [API Client] Refresh token inválido - cerrando sesión');
          const logout = useAppStore.getState().logout;
          logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // Si ya estamos refrescando, añadir a la cola
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = useAppStore.getState().refreshToken;

        if (!refreshToken) {
          console.error('🔒 [API Client] No hay refresh token - cerrando sesión');
          const logout = useAppStore.getState().logout;
          logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        try {
          console.log('🔄 [API Client] Intentando refrescar token...');
          
          // Hacer la petición de refresh
          const { data: refreshData } = await axios.post(
            `${apiClient.defaults.baseURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            { refreshToken }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshData;

          console.log('✅ [API Client] Tokens refrescados exitosamente');

          // Actualizar tokens en el store
          const updateTokens = useAppStore.getState().updateTokens;
          updateTokens(newAccessToken, newRefreshToken);

          // Actualizar el header del request original
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Procesar la cola de requests pendientes
          processQueue(null, newAccessToken);

          // Reintentar el request original
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('❌ [API Client] Error al refrescar token:', refreshError);
          
          processQueue(refreshError as Error, null);
          
          // Si falla el refresh, cerrar sesión
          const logout = useAppStore.getState().logout;
          logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      // Usuario inactivo o bloqueado
      if (status === 403) {
        console.error('🚫 [API Client] Acceso denegado:', data.message);
      }
      
      // Error del servidor
      if (status >= 500) {
        console.error('💥 [API Client] Error del servidor:', data.message);
      }
    } else if (error.request) {
      // Request hecho pero no hay respuesta
      console.error('🌐 [API Client] Error de red: No se recibió respuesta del servidor');
      console.error('🌐 [API Client] Verifica que el backend esté corriendo en:', import.meta.env.VITE_API_URL);
    } else {
      // Error al configurar el request
      console.error('⚙️ [API Client] Error al configurar la petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Tipos para respuestas de error
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

export default apiClient;
