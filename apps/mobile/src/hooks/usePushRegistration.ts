import Constants from 'expo-constants';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSession } from '../providers/SessionProvider';

/**
 * Detecta si estamos corriendo en Expo Go (no en un Development Build).
 * Constants.appOwnership === 'expo' → Expo Go.
 * En Development Builds y standalone es 'standalone' o undefined.
 *
 * IMPORTANTE: en Expo Go con SDK 53+, expo-notifications fue removido
 * para push notifications remotas y CRASHEA al ser importado/inicializado
 * en Android. Por eso NO importamos `expo-notifications` ni `expo-device`
 * a nivel de módulo: solo los cargamos lazy dentro del effect cuando
 * sabemos que no estamos en Expo Go.
 */
const IS_EXPO_GO = Constants.appOwnership === 'expo';

/**
 * Solicita permisos, obtiene el Expo Push Token y lo registra en el backend.
 * Idempotente: el server hace upsert por (member, token).
 *
 * Notas:
 *   - En Expo Go: NO-OP (push notifs no son soportadas, ver IS_EXPO_GO arriba).
 *     Para probar push notifs reales necesitas un Development Build:
 *       npx expo install expo-dev-client
 *       eas build --profile development --platform android
 *   - En simulador iOS no funciona. Lo silenciamos elegantemente.
 *   - Si el user rechaza permisos, no insistimos.
 */
export function usePushRegistration() {
  const { state, api } = useSession();
  const memberId = state.member?.id ?? null;

  useEffect(() => {
    if (!memberId) return;
    if (IS_EXPO_GO) {
      if (__DEV__) {
        console.info(
          '[push] Skipping push registration: running in Expo Go (SDK 53+ no soporta push remotas en Expo Go). Usa Development Build para probar push.',
        );
      }
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const Device = await import('expo-device');
        const Notifications = await import('expo-notifications');

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });

        if (!Device.isDevice) return;

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'BalanceHogar',
            importance: Notifications.AndroidImportance.DEFAULT,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#3B82F6',
          });
        }

        const settings = await Notifications.getPermissionsAsync();
        let finalStatus = settings.status;
        if (finalStatus !== 'granted') {
          const req = await Notifications.requestPermissionsAsync();
          finalStatus = req.status;
        }
        if (finalStatus !== 'granted') return;

        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ??
          Constants.easConfig?.projectId ??
          undefined;

        const token = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined,
        );

        if (cancelled) return;

        await api.notifications.registerPushToken({
          token: token.data,
          platform: Platform.OS === 'ios' ? 'ios' : 'android',
        });
      } catch (error) {
        if (__DEV__) console.warn('[push] register failed', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [api, memberId]);
}
