import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import type { User } from '@prisma/generated/client';
import { SendMessageInput } from '@/src/modules/chat/inputs/send-message.input';
import { ChangeChatSettingsInput } from '@/src/modules/chat/inputs/change-chat-settings.input';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMessagesByStream(streamId: string) {
    return this.prismaService.chatMessage.findMany({
      where: { streamId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });
  }

  async sendMessage(user: User, input: SendMessageInput) {
    const { streamId, text } = input;

    const stream = await this.prismaService.stream.findUnique({
      where: { id: streamId },
    });

    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    if (!stream.isLive) {
      throw new BadRequestException('Stream is not live');
    }

    return this.prismaService.chatMessage.create({
      data: {
        text,
        user: {
          connect: {
            id: user.id,
          },
        },
        stream: {
          connect: {
            id: streamId,
          },
        },
      },
    });
  }

  async changeChatSettings(user: User, input: ChangeChatSettingsInput) {
    const { isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly } =
      input;

    await this.prismaService.stream.update({
      where: { userId: user.id },
      data: {
        isChatEnabled,
        isChatFollowersOnly,
        isChatPremiumFollowersOnly,
      },
    });

    return true;
  }
}
