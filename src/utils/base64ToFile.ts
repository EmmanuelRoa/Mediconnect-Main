/**
 * Convierte una cadena base64 a un objeto Blob
 * @param base64String - Cadena base64 (puede incluir el prefijo data:image/...)
 * @param contentType - Tipo MIME del archivo (por defecto: 'image/jpeg')
 * @returns Blob del archivo
 */
export function base64ToBlob(
  base64String: string,
  contentType: string = 'image/jpeg'
): Blob {
  // Remover el prefijo 'data:image/...;base64,' si existe
  const base64Data = base64String.includes(',')
    ? base64String.split(',')[1]
    : base64String;

  // Decodificar base64 a bytes
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: contentType });
}

/**
 * Convierte una cadena base64 a un objeto File
 * @param base64String - Cadena base64 (puede incluir el prefijo data:image/...)
 * @param fileName - Nombre del archivo
 * @param contentType - Tipo MIME del archivo (por defecto: 'image/jpeg')
 * @returns File del archivo
 */
export function base64ToFile(
  base64String: string,
  fileName: string = 'image.jpg',
  contentType: string = 'image/jpeg'
): File {
  const blob = base64ToBlob(base64String, contentType);
  return new File([blob], fileName, { type: contentType });
}

/**
 * Extrae el tipo MIME de una cadena base64 con prefijo data:
 * @param base64String - Cadena base64 con prefijo (data:image/jpeg;base64,...)
 * @returns El tipo MIME extraído o 'image/jpeg' por defecto
 */
export function getMimeTypeFromBase64(base64String: string): string {
  const match = base64String.match(/data:([^;]+);base64/);
  return match ? match[1] : 'image/jpeg';
}
