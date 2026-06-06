import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailService } from '../libs/mail/mail.service';
import { StorageService } from '@/src/modules/libs/storage/storage.service';
import { TelegramService } from '@/src/modules/libs/telegram/telegram.service';

@Injectable()
export class CronService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly storageService: StorageService,
    private readonly telegramService: TelegramService,
  ) {}

  @Cron('0 0 * * *')
  async deleteDeactivatedAccounts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deactivatedAccounts = await this.prismaService.user.findMany({
      where: {
        isDeactivated: true,
        deactivatedAt: { lte: sevenDaysAgo },
      },
      select: {
        id: true,
        email: true,
        avatar: true,
        telegram_id: true,
        stream: true,
      },
    });

    if (!deactivatedAccounts.length) return;

    const ids = deactivatedAccounts.map(u => u.id);
    await this.prismaService.user.deleteMany({
      where: { id: { in: ids } },
    });

    for (const user of deactivatedAccounts) {
      if (user.avatar) {
        await this.storageService.delete(user.avatar);
      }
      if (user.stream?.thumbnailUrl) {
        await this.storageService.delete(user.stream.thumbnailUrl);
      }

      await this.mailService.sendAccountDeletedMail(user.email);

      if (user.telegram_id) {
        await this.telegramService.sendAccountDeletedMessage(user.telegram_id);
      }
    }
  }
}
