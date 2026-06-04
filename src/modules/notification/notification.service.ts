import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { TokenType, User } from '@prisma/generated/client';
import { ChangeNotificationSettingsInput } from '@/src/modules/notification/inputs/change-notification-settings.input';
import { generateVerificationToken } from '@/src/shared/utils/generate-token.util';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnreadCount(user: User) {
    return this.prismaService.notification.count({
      where: { userId: user.id, isRead: false },
    });
  }

  async findByUser(user: User) {
    await this.prismaService.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });

    return this.prismaService.notification.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async changeSettings(user: User, input: ChangeNotificationSettingsInput) {
    const { site, telegram } = input;

    const settings = await this.prismaService.notificationSettings.update({
      where: { userId: user.id },
      data: { site, telegram },
    });

    if (telegram && !user.telegram_id) {
      const tokenObject = await generateVerificationToken(
        this.prismaService,
        user,
        TokenType.TELEGRAM_AUTH,
        true,
      );
      return { settings, telegramAuthToken: tokenObject.token };
    }

    if (!telegram && user.telegram_id) {
      await this.prismaService.user.update({
        where: { id: user.id },
        data: { telegram_id: null },
      });
    }

    return { settings };
  }
}
