import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { FiltersInput } from '@/src/modules/stream/inputs/filters.input';
import type { StreamWhereInput } from '@prisma/generated/models/Stream';
import { Stream, User } from '@prisma/generated/client';
import { ChangeStreamInfoInput } from '@/src/modules/stream/inputs/change-stream-info.input';
import { FileUpload } from 'graphql-upload-ts';
import sharp from 'sharp';
import { StorageService } from '@/src/modules/libs/storage/storage.service';
import { GenerateStreamTokenInput } from '@/src/modules/stream/inputs/generate-stream-token.input';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class StreamService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(input: FiltersInput) {
    const { limit, skip, searchTerm } = input;

    const whereClause = searchTerm
      ? this.findBySearchTerm(searchTerm)
      : undefined;

    return this.prismaService.stream.findMany({
      take: limit,
      skip: skip,
      where: {
        user: {
          isDeactivated: false,
        },
        ...whereClause,
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async changeStreamInfo(user: User, input: ChangeStreamInfoInput) {
    const { title } = input;

    await this.prismaService.stream.update({
      where: { userId: user.id },
      data: { title },
    });

    return true;
  }

  private async findByUserId(userId: string) {
    const stream = await this.prismaService.stream.findUnique({
      where: { userId: userId },
    });

    if (!stream) {
      throw new BadRequestException(`Stream not found`);
    }

    return stream;
  }

  async changeThumbnail(user: User, thumbnail: Promise<FileUpload>) {
    const file = await thumbnail;

    const stream = await this.findByUserId(user.id);

    if (stream.thumbnailUrl) {
      await this.storageService.delete(stream.thumbnailUrl);
    }

    const chunks: Buffer[] = [];

    for await (const chunk of file.createReadStream()) {
      chunks.push(chunk as Buffer);
    }

    const buffer = Buffer.concat(chunks);
    const fileName = `/streams/${user.username}.webp`;

    const isGif = file.filename?.endsWith('.gif');

    const processedBuffer = await sharp(buffer, { animated: isGif })
      .resize(1920, 1080)
      .webp()
      .toBuffer();

    await this.storageService.upload(processedBuffer, fileName, 'image/webp');

    await this.prismaService.stream.update({
      where: { id: stream.id },
      data: { thumbnailUrl: fileName },
    });

    return true;
  }

  async removeThumbnail(user: User) {
    const stream = await this.findByUserId(user.id);

    if (!stream.thumbnailUrl) {
      return true;
    }

    await this.storageService.delete(stream.thumbnailUrl);

    await this.prismaService.stream.update({
      where: { id: stream.id },
      data: { thumbnailUrl: null },
    });

    return true;
  }

  async findRandomStreams() {
    const LIMIT = 4;

    return this.prismaService.$queryRaw<Stream[]>`
      SELECT s.*, row_to_json(u.*) AS user
      FROM "streams" s
      JOIN "users" u ON u.id = s."user_id"
      WHERE u."is_deactivated" = false
      ORDER BY RANDOM()
      LIMIT ${LIMIT}
    `;
  }

  private findBySearchTerm(searchTerm: string): StreamWhereInput {
    return {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          user: {
            username: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    };
  }

  async generateStreamToken(input: GenerateStreamTokenInput) {
    const { userId, channelId } = input;

    let payload: { id: string; username: string };

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      payload = {
        id: user.id,
        username: user.username,
      };
    } else {
      payload = {
        id: userId,
        username: `Guest ${Math.floor(Math.random() * 100000)}`,
      };
    }

    const channel = await this.prismaService.user.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      throw new NotFoundException(`Channel not found`);
    }

    const isHost = payload.id === channel.id;

    const token = new AccessToken(
      this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
      this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
      {
        identity: isHost ? `Host-${payload.id}` : payload.id,
        name: payload.username,
      },
    );
    token.addGrant({
      room: channelId,
      roomJoin: true,
      canPublish: false,
    });

    return { token: token.toJwt() };
  }
}
