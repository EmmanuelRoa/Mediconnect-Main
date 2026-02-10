// --- ROLES DE USUARIO ---
export type ApiUserRole = 'Paciente' | 'Doctor' | 'Centro' | 'Administrador';
export type AppUserRole = 'PATIENT' | 'DOCTOR' | 'CENTER' | 'ADMINISTRATOR';

// Mapeo de roles de API a roles de aplicación
export const roleMapping: Record<ApiUserRole, AppUserRole> = {
  'Paciente': 'PATIENT',
  'Doctor': 'DOCTOR',
  'Centro': 'CENTER',
  'Administrador': 'ADMINISTRATOR',
};

// Mapeo inverso
export const reverseRoleMapping: Record<AppUserRole, ApiUserRole> = {
  'PATIENT': 'Paciente',
  'DOCTOR': 'Doctor',
  'CENTER': 'Centro',
  'ADMINISTRATOR': 'Administrador',
};


export interface User {
  id: number;
  email: string;
  rol: ApiUserRole | string;
  paciente: Paciente | null;
  doctor: Doctor | null;
  centroSalud: CentroSalud | null;
}

export interface Doctor {
  usuarioId: number;
  nombre: string;
  apellido: string;
  numeroDocumentoIdentificacion: string;
  fotoDocumento: string | null;
  fotoPerfil: string | null;
  fechaNacimiento: string; // ISO Date string
  genero: string;
  nacionalidad: string;
  exequatur: string;
  biografia: string;
  anosExperiencia: number;
  estadoVerificacion: string;
  calificacionPromedio: string;
  estado: string;
  creadoEn: string; // ISO Date string
  actualizadoEn: string; // ISO Date string
  certificacionesAdicionales: string[] | null;
  tituloAcademico: string | null;
  tipoDocIdentificacion: string;
  ubicacionId: number | null;
  duracionCitaPromedio: number;
  tarifas: any | null; // Puedes definir una interfaz Tarifa si conoces la estructura
  ubicacion: any | null; // Puedes definir una interfaz Ubicacion si conoces la estructura
  formaciones: any[]; // Array de formaciones
}


export interface Paciente {
  // Define las propiedades del paciente aquí cuando las tengas
  [key: string]: any;
}

export interface CentroSalud {
  // Define las propiedades del centro de salud aquí
  [key: string]: any;
}
// --- LOGIN CON EMAIL/PASSWORD ---
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  usuario: User;
}

// --- LOGIN CON GOOGLE ---
export interface GoogleLoginRequest {
  idToken: string;
}

export interface GoogleLoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

// --- SOLICITAR CÓDIGO OTP ---
export interface SolicitarCodigoRequest {
  email: string;
}

export interface SolicitarCodigoResponse {
  success: boolean;
  message: string;
}

// --- VALIDAR CÓDIGO OTP ---
export interface ValidarCodigoRequest {
  email: string;
  codigo: string;
}

export interface ValidarCodigoResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

// --- USUARIO NORMALIZADO (para el store) ---
export interface NormalizedUser {
  id: string;
  name: string;
  email: string;
  role: AppUserRole;
  avatar?: string;
  banner?: string;
}

// --- UTILIDADES DE TRANSFORMACIÓN ---
/**
 * Transforma la respuesta del login retornando el usuario completo del API
 */
export function normalizeLoginResponse(response: LoginResponse): {
  accessToken: string;
  refreshToken: string;
  user: User;
} {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    user: {
      id: response.usuario.id,
      email: response.usuario.email,
      rol: getUserAppRole(response.usuario) || response.usuario.rol,
      paciente: response.usuario.paciente || null,
      doctor: response.usuario.doctor || null,
      centroSalud: response.usuario.centroSalud || null,
    },
  };
}

/**
 * Transforma la respuesta del login con Google retornando un objeto User completo
 */
export function normalizeGoogleLoginResponse(response: GoogleLoginResponse): {
  accessToken: string;
  refreshToken: string;
  user: User;
} {
  // Google login retorna una estructura simplificada, construir el User completo
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    user: {
      id: response.user.id,
      email: response.user.email,
      rol: getUserAppRole(response.user) || response.user.rol,
      paciente: response.user.paciente || null,
      doctor: response.user.doctor || null,
      centroSalud: response.user.centroSalud || null,
    },
  };
}

// --- ERRORES DE AUTENTICACIÓN ---
export interface AuthError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  USER_INACTIVE: 'Usuario inactivo o bloqueado',
  EMAIL_ALREADY_EXISTS: 'El correo ya está registrado',
  INVALID_OTP: 'Código OTP inválido o expirado',
  INVALID_TOKEN: 'Token inválido o expirado',
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde',
} as const;

// --- REFRESH TOKEN ---
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

// --- UTILIDADES PARA TRABAJAR CON EL USUARIO ---
/**
 * Obtiene el nombre completo del usuario según su rol
 */
export function getUserFullName(user: User | null): string {
  if (!user) return '';
  
  if (user.doctor) {
    return `${user.doctor.nombre} ${user.doctor.apellido}`;
  } else if (user.paciente && user.paciente.nombre) {
    return `${user.paciente.nombre} ${user.paciente.apellido || ''}`.trim();
  } else if (user.centroSalud && user.centroSalud.nombre) {
    return user.centroSalud.nombre;
  }
  
  // Fallback: usar el email
  return user.email.split('@')[0];
}

/**
 * Obtiene las iniciales del usuario para el avatar
 */
export function getUserInitials(user: User | null): string {
  if (!user) return '';
  const fullName = getUserFullName(user);
  const names = fullName.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  } else {
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }
}


/**
 * Obtiene el rol de la aplicación a partir del usuario
 */
export function getUserAppRole(user: User | null): AppUserRole | null {
  if (!user) return null;
  return roleMapping[user.rol as ApiUserRole] || null;
}

/**
 * Obtiene el avatar del usuario según su rol
 */
export function getUserAvatar(user: User | null): string | undefined {
  if (!user) return undefined;
  
  if (user.doctor?.fotoPerfil) {
    return user.doctor.fotoPerfil;
  } else if (user.paciente?.fotoPerfil) {
    return user.paciente.fotoPerfil;
  } else if (user.centroSalud?.logo) {
    return user.centroSalud.logo;
  }
  
  return undefined;
}
