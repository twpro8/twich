import { Markup } from 'telegraf';

export const BUTTONS = {
  authSuccess: Markup.inlineKeyboard([
    [
      Markup.button.callback('📋 My followings', 'followings'),
      Markup.button.callback('🧑 Profile', 'me'),
    ],
    [Markup.button.url('🌐 Web site', 'https://twpro.com')],
  ]),
  profile: Markup.inlineKeyboard([
    Markup.button.url('🔩 Settings', 'https://twpro.com/dashboard/settings'),
  ]),
};
