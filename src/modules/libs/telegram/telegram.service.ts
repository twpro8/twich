import { BadRequestException, Injectable } from '@nestjs/common';
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '@prisma/generated/enums';
import { User } from '@prisma/generated/client';
import { MESSAGES } from '@/src/modules/libs/telegram/telegram.message';
import { BUTTONS } from '@/src/modules/libs/telegram/telegram.buttons';

@Update()
@Injectable()
export class TelegramService extends Telegraf {
  private readonly _token: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'));
    this._token = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
  }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id?.toString();
    if (!chatId) {
      throw new BadRequestException('Chat ID not found');
    }

    if (!ctx.message || !('text' in ctx.message)) {
      return;
    }

    const token = ctx.message.text.split(' ')[1];
    if (!token) {
      const user = await this.findUserByChatId(chatId);

      if (!user) {
        await ctx.replyWithHTML(MESSAGES.invalidToken);
        return;
      }

      await this.onMe(ctx);
      await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.authSuccess);
      return;
    }

    const authToken = await this.prismaService.token.findFirst({
      where: {
        token,
        type: TokenType.TELEGRAM_AUTH,
      },
    });

    if (!authToken || authToken.expiresAt < new Date()) {
      await ctx.reply(MESSAGES.invalidToken);
      return;
    }

    await this.connectTelegram(authToken.userId, chatId);

    await this.prismaService.token.delete({
      where: { id: authToken.id },
    });

    await ctx.replyWithHTML(MESSAGES.authSuccess, BUTTONS.authSuccess);
  }

  @Command('me')
  @Action('me')
  async onMe(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id?.toString();

    if (!chatId) {
      throw new BadRequestException('Chat ID not found');
    }

    const user = await this.findUserByChatId(chatId);

    await ctx.replyWithHTML(MESSAGES.profile(user), BUTTONS.profile);
  }

  private async connectTelegram(userId: string, chatId: string): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { telegram_id: chatId },
    });
  }

  private async findUserByChatId(chatId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { telegram_id: chatId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
