/**
 * Interfaz mínima para persistir el token de sesión.
 * No acoplamos al cliente a `expo-secure-store` ni a `AsyncStorage`:
 * cada plataforma inyecta su propia implementación.
 */
export interface TokenStorage {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
}

/** Storage en memoria (útil para tests / SSR). */
export class InMemoryTokenStorage implements TokenStorage {
  private value: string | null = null;

  async getToken(): Promise<string | null> {
    return this.value;
  }

  async setToken(token: string): Promise<void> {
    this.value = token;
  }

  async clearToken(): Promise<void> {
    this.value = null;
  }
}
