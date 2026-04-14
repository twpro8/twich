import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import {
  validateFileExtension,
  validateFileSize,
} from '@/src/shared/utils/file.util';
import type { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  async transform(value: Promise<FileUpload>) {
    const file: FileUpload = await value;

    if (!file.filename) {
      throw new BadRequestException('File is not uploaded');
    }

    const allowedExtensions = ['.jpg', '.png', '.jpeg', '.gif', '.webp'];
    const isFileExtensionValid = validateFileExtension(
      file.filename,
      allowedExtensions,
    );

    if (!isFileExtensionValid) {
      throw new BadRequestException('Unsupported file format');
    }

    const fileStream = file.createReadStream();

    const isFileSizeValid = await validateFileSize(
      fileStream,
      10 * 1024 * 1024,
    );

    if (!isFileSizeValid) {
      throw new BadRequestException('File size exceeded 10MB');
    }

    return value;
  }
}
