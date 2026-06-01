import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async findRecommended() {
    return this.prismaService.user.findMany({
      where: { isDeactivated: false },
      orderBy: {
        followings: {
          _count: 'desc',
        },
      },
      include: {
        stream: true,
      },
      take: 7,
    });
  }

  async findByUsername(username: string) {
    const channel = await this.prismaService.user.findUnique({
      where: { username, isDeactivated: false },
      include: {
        socialLinks: {
          orderBy: {
            position: 'asc',
          },
        },
        stream: {
          include: {
            category: true,
          },
        },
        followings: true,
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  async findFollowersCountByChannelId(channelId: string) {
    return this.prismaService.follow.count({
      where: { followingId: channelId },
    });
  }
}
