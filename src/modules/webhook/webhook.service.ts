import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { LivekitService } from '@/src/modules/libs/livekit/livekit.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly livekitService: LivekitService,
  ) {}

  async receiveWebhookLivekit(body: string, authorization: string) {
    const event = this.livekitService.receiver.receive(
      body,
      authorization,
      false,
    );

    if (event.event === 'ingress_started') {
      console.log('STREAM STARTED: ', event.ingressInfo?.url);

      await this.prismaService.stream.update({
        where: { ingressId: event.ingressInfo?.ingressId },
        data: { isLive: true },
      });
    }

    if (event.event === 'ingress_ended') {
      console.log('STREAM ENDED');
      await this.prismaService.stream.update({
        where: { ingressId: event.ingressInfo?.ingressId },
        data: { isLive: false },
      });
    }
  }
}
