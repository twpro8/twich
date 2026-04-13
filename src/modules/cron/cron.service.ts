import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailService } from '../libs/mail/mail.service';

@Injectable()
export class CronService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  @Cron('0 0 * * *')
  public async deleteDeactivatedAccounts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const deactivatedAccounts = await this.prismaService.user.findMany({
      where: {
        isDeactivated: true,
        deactivatedAt: { lte: sevenDaysAgo },
      },
      select: { id: true, email: true },
    });
    if (!deactivatedAccounts.length) return;
    const ids = deactivatedAccounts.map((u) => u.id);
    await this.prismaService.user.deleteMany({
      where: { id: { in: ids } },
    });
    for (const user of deactivatedAccounts) {
      await this.mailService.sendAccountDeletedMail(user.email);
    }
  }
}
