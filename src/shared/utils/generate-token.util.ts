import { TokenType, type User } from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { randomInt, randomUUID } from 'crypto';

export async function generateVerificationToken(
  prismaService: PrismaService,
  user: User,
  type: TokenType,
  isUUID: boolean = false,
) {
  let token: string;

  if (isUUID) {
    token = randomUUID();
  } else {
    token = randomInt(100000, 999999).toString();
  }

  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 5); // 5 minutes

  const existingToken = await prismaService.token.findFirst({
    where: {
      type,
      user: {
        id: user.id,
      },
    },
  });

  if (existingToken) {
    await prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  return prismaService.token.create({
    data: {
      token,
      type,
      expiresAt,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
    include: {
      user: true,
    },
  });
}
