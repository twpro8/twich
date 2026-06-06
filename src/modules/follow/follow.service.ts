import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { User } from '@prisma/generated/client';
import { NotificationService } from '@/src/modules/notification/notification.service';
import { TelegramService } from '@/src/modules/libs/telegram/telegram.service';

@Injectable()
export class FollowService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly telegramService: TelegramService,
  ) {}

  async findMyFollowers(user: User) {
    return this.prismaService.follow.findMany({
      where: {
        followingId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        follower: true,
      },
    });
  }

  async findMyFollows(user: User) {
    return this.prismaService.follow.findMany({
      where: {
        followerId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        following: true,
      },
    });
  }

  async follow(user: User, channelId: string) {
    if (channelId === user.id) {
      throw new ConflictException('Cannot follow yourself');
    }

    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
      include: {
        notificationSettings: true,
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    const existingFollow = await this.prismaService.follow.findFirst({
      where: {
        followerId: user.id,
        followingId: channelId,
      },
    });

    if (existingFollow) {
      throw new ConflictException(
        'You have already been following this channel',
      );
    }

    await this.prismaService.follow.create({
      data: {
        followerId: user.id,
        followingId: channelId,
      },
    });

    if (channel.notificationSettings?.site) {
      await this.notificationService.sendNewFollowerNotification(
        user,
        channelId,
      );
    }

    if (channel.telegram_id) {
      await this.telegramService.sendNewFollowerMessage(
        channel.telegram_id,
        user,
      );
    }

    return true;
  }

  async unfollow(user: User, channelId: string) {
    const existingFollow = await this.prismaService.follow.findFirst({
      where: {
        followerId: user.id,
        followingId: channelId,
      },
    });

    if (!existingFollow) {
      throw new ConflictException('You have not been following this channel');
    }

    await this.prismaService.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });

    return true;
  }
}
