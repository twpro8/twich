import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { LivekitService } from '@/src/modules/libs/livekit/livekit.service';
import type { User } from '@prisma/generated/client';
import {
  CreateIngressOptions,
  IngressAudioEncodingPreset,
  IngressInput,
  IngressVideoEncodingPreset,
} from 'livekit-server-sdk';

@Injectable()
export class IngressService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly livekitService: LivekitService,
  ) {}

  async createIngress(user: User, ingressType: IngressInput) {
    await this.resetIngresses(user);

    const options: CreateIngressOptions = {
      name: user.name,
      roomName: user.id,
      participantName: user.name,
      participantIdentity: user.id,
    };

    if (ingressType === IngressInput.WHIP_INPUT) {
      options.bypassTranscoding = true;
    } else {
      options.video = {
        source: 1,
        preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
      };
      options.audio = {
        source: 2,
        preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
      };
    }

    const ingress = await this.livekitService.ingress.createIngress(
      ingressType,
      options,
    );

    console.log('Ingress result:', JSON.stringify(ingress, null, 2));

    if (!ingress || !ingress.url || !ingress.streamKey) {
      throw new BadRequestException('Failed to create ingress');
    }

    await this.prismaService.stream.update({
      where: { userId: user.id },
      data: {
        ingressId: ingress.ingressId,
        serverUrl: ingress.url,
        streamKey: ingress.streamKey,
      },
    });

    return true;
  }

  private async resetIngresses(user: User) {
    try {
      const ingresses = await this.livekitService.ingress.listIngress({
        roomName: user.id,
      });

      for (const ingress of ingresses) {
        if (ingress.ingressId) {
          await this.livekitService.ingress.deleteIngress(ingress.ingressId);
        }
      }
    } catch (e) {
      console.warn(
        'resetIngresses: listIngress failed, skipping reset',
        e?.message,
      );
    }

    try {
      const rooms = await this.livekitService.room.listRooms([user.id]);

      for (const room of rooms) {
        await this.livekitService.room.deleteRoom(room.name);
      }
    } catch (e) {
      console.warn(
        'resetIngresses: listRooms failed, skipping room cleanup',
        e?.message,
      );
    }
  }
}
