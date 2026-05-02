/**
 * Devuelve las iniciales de un nombre para mostrarlas en avatares.
 * `"María del Carmen Pérez"` → `"MP"`, `"Juan"` → `"J"`.
 */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === '') return '?';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts.at(-1)!.charAt(0)).toUpperCase();
}

/**
 * Genera un código de invitación de longitud `length` con caracteres
 * alfanuméricos en mayúsculas. Excluye `0/O` y `1/I/L` para evitar confusión.
 *
 * Acepta una función `random` para testabilidad (por defecto `Math.random`).
 * En producción del backend usar `crypto.randomBytes` (mucho más entrópico)
 * en lugar de esta utilidad genérica; vive aquí para fallback en cliente.
 */
const INVITE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateInviteCode(
  length: number,
  random: () => number = Math.random,
): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(random() * INVITE_ALPHABET.length);
    code += INVITE_ALPHABET.charAt(idx);
  }
  return code;
}
