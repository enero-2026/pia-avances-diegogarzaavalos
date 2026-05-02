import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { createApiClient, type BalanceHogarApi } from '@balancehogar/api-client';
import { secureTokenStorage } from '../storage/secureTokenStorage';

/**
 * Resuelve la URL del backend en runtime.
 *
 * - En producción: `EXPO_PUBLIC_API_URL` definido en el build.
 * - En dev: si no se setea, intentamos detectar la IP del host de Metro
 *   (`expoConfig.hostUri`) y servir contra `http://<host>:3000/api`.
 *   Esto permite probar contra `pnpm --filter @balancehogar/api dev`
 *   sin tener que cambiar nada por entorno.
 */
function resolveBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const expoConfig = Constants as unknown as {
    expoConfig?: { hostUri?: string };
    expoGoConfig?: { hostUri?: string };
  };
  const hostUri =
    expoConfig.expoConfig?.hostUri ?? expoConfig.expoGoConfig?.hostUri ?? null;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host) return `http://${host}:3000/api`;
  }

  if (Platform.OS === 'android') return 'http://10.0.2.2:3000/api';
  return 'http://localhost:3000/api';
}

let apiSingleton: BalanceHogarApi | null = null;
let onUnauthorizedListener: (() => void) | null = null;

export function setOnUnauthorized(listener: () => void) {
  onUnauthorizedListener = listener;
}

export function getApi(): BalanceHogarApi {
  if (apiSingleton) return apiSingleton;
  apiSingleton = createApiClient({
    baseUrl: resolveBaseUrl(),
    storage: secureTokenStorage,
    onUnauthorized: () => onUnauthorizedListener?.(),
  });
  return apiSingleton;
}

export function getApiBaseUrl(): string {
  return getApi().client.baseUrl;
}
