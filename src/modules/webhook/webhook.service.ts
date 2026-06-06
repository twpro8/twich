import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { LivekitService } from '@/src/modules/libs/livekit/livekit.service';
import { NotificationService } from '@/src/modules/notification/notification.service';
import { TelegramService } from '@/src/modules/libs/telegram/telegram.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly livekitService: LivekitService,
    private readonly notificationService: NotificationService,
    private readonly telegramService: TelegramService,
  ) {}

  async receiveWebhookLivekit(body: string, authorization: string) {
    const event = this.livekitService.receiver.receive(
      body,
      authorization,
      false,
    );

    if (event.event === 'ingress_started') {
      console.log('STREAM STARTED: ', event.ingressInfo?.url);

      const stream = await this.prismaService.stream.update({
        where: { ingressId: event.ingressInfo?.ingressId },
        data: { isLive: true },
        include: { user: true },
      });

      const followers = await this.prismaService.follow.findMany({
        where: { followingId: stream.user?.id },
        include: { follower: { include: { notificationSettings: true } } },
      });

      for (const follow of followers) {
        const follower = follow.follower;

        if (stream.user && follower.notificationSettings?.site) {
          await this.notificationService.sendStreamStartedNotification(
            stream.user,
            follower.id,
          );
        }

        if (stream.user && follower?.telegram_id) {
          await this.telegramService.sendStreamStartedMessage(
            follower.telegram_id,
            stream.user,
          );
        }
      }
    }

    if (event.event === 'ingress_ended') {
      console.log('STREAM ENDED');
      const stream = await this.prismaService.stream.update({
        where: { ingressId: event.ingressInfo?.ingressId },
        data: { isLive: false },
      });

      await this.prismaService.chatMessage.deleteMany({
        where: { streamId: stream.id },
      });
    }
  }
}
