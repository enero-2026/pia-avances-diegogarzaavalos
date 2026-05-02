import type { Member } from '../domain/member';
import type { Residence } from '../domain/residence';

/**
 * Resultado del flujo de auth (crear residencia o unirse).
 * Devuelve el token de sesión + el miembro y la residencia con la que
 * el cliente puede arrancar la UI sin pedir más al backend.
 */
export type AuthResponse = {
  token: string;
  member: Member;
  residence: Residence;
};
