import type { AttachmentId, ExpenseId, MemberId } from './ids';
import type { ISODateTime } from './primitives';

/**
 * Tipos MIME aceptados según el brief: fotos del recibo (`image/*`) o PDFs
 * (capturas de pantalla, recibos digitales tipo Netflix).
 *
 * `image/heic` se incluye porque iPhone toma fotos en HEIC por defecto.
 */
export type AttachmentMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/heic'
  | 'image/webp'
  | 'application/pdf';

/**
 * Comprobante adjunto a un gasto. Una foto del recibo, una captura de pantalla
 * de la app del banco, un PDF del estado de cuenta, etc.
 *
 * - `url`: en fase local apunta a un path de filesystem del dispositivo;
 *   en fase de sync apuntará a una URL de S3/R2.
 * - `sizeBytes`: útil para mostrar tamaño y para limitar uploads.
 */
export type Attachment = {
  id: AttachmentId;
  expenseId: ExpenseId;
  /** Quién subió el archivo. */
  uploadedById: MemberId;
  url: string;
  mimeType: AttachmentMimeType;
  sizeBytes: number;
  uploadedAt: ISODateTime;
};
