import { Markup } from 'telegraf';

export const BUTTONS = {
  authSuccess: Markup.inlineKeyboard([
    [
      Markup.button.callback('📚 My Followings', 'followings'),
      Markup.button.callback('👤 My Profile', 'me'),
    ],
    [Markup.button.url('⚙️ Dashboard', 'https://twpro.com')],
  ]),
  profile: Markup.inlineKeyboard([
    [Markup.button.callback('📚 My Followings', 'followings')],
    [
      Markup.button.url(
        '⚙️ Account Settings',
        'https://twpro.com/dashboard/settings',
      ),
    ],
  ]),
};
