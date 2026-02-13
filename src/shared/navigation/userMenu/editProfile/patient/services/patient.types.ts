// --- TIPOS PARA ACTUALIZACIÓN DE PERFIL DE PACIENTE ---

export interface UpdatePatientProfileRequest {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  fechaNacimiento?: string; // ISO Date string
  genero?: string;
  altura?: number;
  peso?: number;
  tipoSangre?: string;
  ubicacionId?: number;
  estado?: 'Activo' | 'Inactivo';
}

export interface UpdatePatientProfileResponse {
  success: boolean;
  message: string;
  data: {
    usuarioId: number;
    nombre: string;
    apellido: string;
    numero_documento_identificacion: string;
    tipoDocIdentificacion: string;
    foto_documento: string | null;
    fechaNacimiento: string;
    genero: string;
    altura: number | null;
    peso: number | null;
    tipoSangre: string | null;
    estado: string;
    ubicacionId: number | null;
    creadoEn: string;
    actualizadoEn: string | null;
  };
}

export interface UpdatePatientProfileError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}
