import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MailService } from '../../libs/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { TokenType } from '@/prisma/generated/enums';
import { destroySession } from '@/src/shared/utils/session.util';
import type { User } from '@/prisma/generated/client';
import { generateVerificationToken } from '@/src/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { AccountDeactivationInput } from './inputs/account-deactivation.input';
import { verify } from 'argon2';

@Injectable()
export class DeactivationService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  public async deactivateAccount(
    req: Request, 
    user: User, 
    input: AccountDeactivationInput,
    userAgent: string,
  ) {
    const { email, password, code } = input;

    if (user.email !== email) {
      throw new BadGatewayException('Incorrect email');
    }

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password')
    }

    if (!code) {
      await this.sendDeactivationToken(req, user, userAgent);
      return {
        message: 'Confirmation is required. A confirmation code was sent to your inbox — please check your spam folder if you did not receive it.',
      };
    }

    await this.validateDeactivationToken(req, code);

    return { user };
  }

  private async validateDeactivationToken(req: Request, token: string) {
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.ACCOUNT_DEACTIVATION,
      }
    });

    if (!existingToken) {
      throw new NotFoundException('Deactivation token not found');
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date();
    if (hasExpired) {
      throw new BadRequestException('Deactivation code has expired');
    }

    await this.prismaService.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        isDeactivated: true,
        deactivatedAt: new Date(),
      },
    });
    
    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    });

    return destroySession(req, this.configService);
  }

  public async sendDeactivationToken(req: Request, user: User, userAgent: string) {
    const deactivationToken = await generateVerificationToken(
      this.prismaService, 
      user, 
      TokenType.ACCOUNT_DEACTIVATION, 
      false,
    )

    const metadata = getSessionMetadata(req, userAgent);

    await this.mailService.sendAccountDeactivationToken(
      user.email, 
      deactivationToken.token,
      metadata
    );

    return true;
  }
}
