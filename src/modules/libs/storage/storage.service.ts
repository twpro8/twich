import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  type DeleteObjectCommandInput,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      endpoint: this.configService.getOrThrow<string>('AWS_S3_ENDPOINT'),
      region: this.configService.getOrThrow<string>('AWS_REGION'),
    });
    this.bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
  }

  async upload(buffer: Buffer, key: string, mimeType: string) {
    const cmd: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    };

    try {
      await this.client.send(new PutObjectCommand(cmd));
    } catch (error) {
      console.error(`Failed to upload the file: ${error}`);
      throw error;
    }
  }

  async delete(key: string) {
    const cmd: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.client.send(new DeleteObjectCommand(cmd));
    } catch (error) {
      console.error(`Failed to delete the file: ${error}`);
      throw error;
    }
  }
}
