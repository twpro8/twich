import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { LoginInput } from '../session/inputs/login.input';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { RedisService } from '@/src/core/redis/redis.service';
import { destroySession, saveSession } from '@/src/shared/utils/session.util';
import { VerificationService } from '../verification/verification.service';

@Injectable()
export class SessionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly verificationService: VerificationService,
  ) {}

  public async findByUser(req: Request) {
    const userId = req.session.userId;

    if (!userId) {
      throw new NotFoundException('User not found in the session');
    }

    const keys = await this.redisService.client.keys('*');

    const userSessions: any[] = [];

    for (const key of keys) {
      const sessionData = await this.redisService.client.get(key);
      
      if (sessionData) {
        const parsed = JSON.parse(sessionData);

        if (parsed.userId === userId) {
          userSessions.push({
            ...parsed,
            id: key.split(':')[1],
          });
        }
      }
    }

    userSessions.sort((a, b) => b.createdAt - a.createdAt);

    return userSessions.filter(session => session.id !== req.session.id);
  }

  public async findCurrentSession(req: Request) {
    const sessionId = req.session.id;

    const sessionData = await this.redisService.client.get(
      `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
    );

    if (!sessionData) {
      throw new NotFoundException('Session not found');
    }

    const parsed = JSON.parse(sessionData);

    return { ...parsed, id: sessionId };
  }

  public async login(req: Request, input: LoginInput, userAgent: string) {
    const { login, password } = input;

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: { equals: login } },
          { email: { equals: login } },
        ]
      },
    })

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.isActive) {
      await this.verificationService.sendVerificationToken(user);
      throw new BadRequestException(
        'Email address not verified. A verification link was sent to your inbox — please check your spam folder if you did not receive it.'
      )
    }

    const metadata = getSessionMetadata(req, userAgent);

    return saveSession(req, user, metadata);
  }

  public async logout(req: Request) {
    return destroySession(req, this.configService);
  }

  public async clearSession(req: Request) {
    req.res?.clearCookie(
      this.configService.getOrThrow<string>('SESSION_NAME')
    );
    return true;
  }

  public async removeSession(req: Request, id: string) {
    if (req.session.id === id) {
      throw new ConflictException('Current session cannot be deleted');
    }

    await this.redisService.client.del(
      `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
    );

    return true;
  }
}
