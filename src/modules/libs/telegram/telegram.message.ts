import { User } from '@prisma/generated/client';
import { SessionMetadata } from '@/src/shared/types/session-metadata.types';

export const MESSAGES = {
  welcome: `
👋 Welcome to TWPro!

Track your followings, manage your profile, and stay up to date with everything that matters.
  `.trim(),

  authSuccess: `
✅ Authentication successful!

Your account has been linked. Choose an action below to continue.
  `.trim(),

  invalidToken: `
❌ Authorization failed

The link is invalid or has expired. Please try logging in again.
  `.trim(),

  profile: (user: User) =>
    `
👤 <b>Your Profile</b>

🧑 Name: <b>${user.name}</b>
📧 Email: <b>${user.email}</b>

Manage your account settings or explore your followings below.
  `.trim(),

  resetPassword: (
    token: string,
    metadata: SessionMetadata,
  ) => ` <b>🔐 Password Reset Request</b>

You requested a password reset for your <b>Lumière</b> account.

To create a new password, please use the link below:

<b><a href="https://lumiere.com/account/recovery/${token}">🔑 Reset Password</a></b>

<b>📅 Request Date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

<b>📍 Location:</b> ${metadata.location.country}, ${metadata.location.city} <b>💻 Operating System:</b> ${metadata.device.os} <b>🌐 Browser:</b> ${metadata.device.browser} <b>🛰️ IP Address:</b> ${metadata.ip}

If you did not request a password reset, you can safely ignore this message.

Thank you for using <b>Lumière</b> ❤️
`,
};
