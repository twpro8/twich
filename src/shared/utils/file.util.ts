import type { ReadStream } from 'graphql-upload-ts';

export function validateFileExtension(
  filename: string,
  allowedExtensions: string[],
): boolean {
  const fileExtension = `.${filename.split('.').pop()?.toLowerCase()}`;
  return allowedExtensions.includes(fileExtension);
}

export async function validateFileSize(
  fileStream: ReadStream,
  allowedFileSizeInBytes: number,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let fileSize = 0;

    fileStream
      .on('data', (chunk: Buffer) => {
        fileSize += chunk.byteLength;
      })
      .on('end', () => {
        resolve(fileSize <= allowedFileSizeInBytes);
      })
      .on('error', err => {
        reject(err);
      });
  });
}
