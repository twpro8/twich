import { User } from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Secret, TOTP } from 'otpauth';
import { toDataURL } from 'qrcode';
import type { EnableTotpInput } from './inputs/enable-totp.input';

@Injectable()
export class TotpService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateTotpKey(user: User) {
    const totp = new TOTP({
      issuer: 'Twich',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      secret: new Secret({ size: 20 }),
    });

    const otpSecret = totp.secret.base32;
    const otpAuthUrl = totp.toString();
    const qrCodeUrl = await toDataURL(otpAuthUrl);

    return { qrCodeUrl, secret: otpSecret };
  }

  async enableTotp(user: User, input: EnableTotpInput) {
    const { secret, code } = input;

    const totp = new TOTP({
      issuer: 'Twich',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      secret,
    });

    const delta = totp.validate({ token: code });
    if (delta === null) {
      throw new BadRequestException('Incorrect code');
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        totpKey: secret,
      },
    });

    return true;
  }

  async disableTotp(user: User) {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        totpKey: null,
      },
    });

    return true;
  }
}
