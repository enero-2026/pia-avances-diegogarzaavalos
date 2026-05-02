import { z } from 'zod';

/** POST /api/notifications/:id/read */
export const markNotificationReadSchema = z.object({
  readAt: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe('Si se omite, el servidor usa now().'),
});

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>;

/** POST /api/devices/push-token — Registrar token de Expo Push del dispositivo. */
export const registerPushTokenSchema = z.object({
  token: z
    .string()
    .min(1)
    .describe('Token de Expo Push (ej: ExponentPushToken[xxxx]).'),
  platform: z.enum(['ios', 'android']),
});

export type RegisterPushTokenInput = z.infer<typeof registerPushTokenSchema>;
