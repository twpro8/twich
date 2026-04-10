import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MailService } from '../../libs/mail/mail.service';
import { Request } from 'express';
import { VerificationInput } from './inputs/verification.input';
import { TokenType } from '@/prisma/generated/enums';
import { saveSession } from '@/src/shared/utils/session.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { generateVerificationToken } from '@/src/shared/utils/generate-token.util';
import { User } from '@/prisma/generated/client';

@Injectable()
export class VerificationService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async verifyEmail(
    req: Request, 
    input: VerificationInput, 
    userAgent: string,
  ) {
    const { token } = input;

    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.EMAIL_VERIFY,
      }
    });

    if (!existingToken) {
      throw new NotFoundException('Verification token not found');
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date();
    if (hasExpired) {
      throw new BadRequestException('Verification code has expired');
    }

    const user = await this.prismaService.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        isActive: true,
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    });

    const metadata = getSessionMetadata(req, userAgent);

    return saveSession(req, user, metadata);
  }

  public async sendVerificationToken(user: User) {
    const verificationToken = await generateVerificationToken(
      this.prismaService, 
      user, 
      TokenType.EMAIL_VERIFY, 
      true,
    )

    await this.mailService.sendVerificationToken(
      user.email, 
      verificationToken.token,
    );

    return true;
  }
}
