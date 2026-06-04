import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { LivekitService } from '@/src/modules/libs/livekit/livekit.service';
import { NotificationService } from '@/src/modules/notification/notification.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly livekitService: LivekitService,
    private readonly notificationService: NotificationService,
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
