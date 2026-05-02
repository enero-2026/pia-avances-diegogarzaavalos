import type { Attachment } from '@balancehogar/types';
import type { ApiClient } from '../client';

export type AttachmentUploadInput = {
  expenseId: string;
  /**
   * Identificador del recurso a subir. En React Native, lo más común es pasar
   * `{ uri, name, type }`; el cliente se encarga de armar el FormData.
   */
  file: { uri: string; name: string; type: string };
};

export class AttachmentsResource {
  constructor(private readonly client: ApiClient) {}

  /** GET /api/expenses/:id/attachments */
  async listByExpense(expenseId: string): Promise<Attachment[]> {
    return this.client.request<Attachment[]>(
      `/expenses/${expenseId}/attachments`,
    );
  }

  /**
   * POST /api/expenses/:id/attachments (multipart).
   *
   * En React Native, FormData acepta objetos `{ uri, name, type }` directamente.
   * No fijamos `Content-Type` para que el runtime agregue el `boundary` correcto.
   */
  async upload(input: AttachmentUploadInput): Promise<Attachment> {
    const form = new FormData();
    form.append('file', {
      uri: input.file.uri,
      name: input.file.name,
      type: input.file.type,
    } as unknown as Blob);

    return this.client.request<Attachment>(
      `/expenses/${input.expenseId}/attachments`,
      {
        method: 'POST',
        rawBody: form as unknown as BodyInit,
        headers: {
          // Forzamos undefined para que fetch ponga el boundary multipart.
          // Como `headers` no acepta undefined, no incluimos Content-Type aquí.
        },
      },
    );
  }

  /** Devuelve la URL absoluta para descargar/abrir el adjunto en un viewer. */
  fileUrl(attachmentId: string): string {
    return `${this.client.baseUrl}/attachments/${attachmentId}/file`;
  }

  /** DELETE /api/attachments/:id */
  async delete(attachmentId: string): Promise<void> {
    await this.client.request<void>(`/attachments/${attachmentId}`, {
      method: 'DELETE',
    });
  }
}
