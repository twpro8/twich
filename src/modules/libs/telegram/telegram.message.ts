import { User } from '@prisma/generated/client';
import { SessionMetadata } from '@/src/shared/types/session-metadata.types';

export const MESSAGES = {
  welcome: `
👋 Welcome to Lumière!

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
  accountDeactivation: (
    token: string,
    metadata: SessionMetadata,
  ) => ` <b>⚠️ Account Deactivation Request</b>

You have initiated the deactivation process for your <b>Lumière</b> account.

To confirm this action, please use the verification code below:

<b>🔑 Verification Code: ${token}</b>

<b>📅 Request Date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

<b>📍 Location:</b> ${metadata.location.country}, ${metadata.location.city} <b>💻 Operating System:</b> ${metadata.device.os} <b>🌐 Browser:</b> ${metadata.device.browser} <b>🛰️ IP Address:</b> ${metadata.ip}

<b>ℹ️ What happens after deactivation?</b>

• You will be signed out of your account.
• Access to your account will be temporarily disabled.
• If the deactivation is not cancelled within <b>7 days</b>, your account and all associated data will be permanently deleted.

<b>⚠️ Important:</b>

If you change your mind within 7 days, please contact our support team to restore access before permanent deletion.

After your account is deleted, recovery will no longer be possible.

If you did not request this action, simply ignore this message and your account will remain active.

Thank you for using <b>Lumière</b> ❤️
`,

  accountDeleted: ` <b>🗑️ Account Permanently Deleted</b>

Your <b>Lumière</b> account has been permanently removed from our system.

All associated information, settings, subscriptions, and personal data have been deleted and cannot be recovered.

<b>📭 Notifications Disabled</b>

You will no longer receive notifications from Lumière via Telegram or email.

If you would like to return in the future, you can create a new account here:

<b><a href="https://lumiere.com/account/create">✨ Create a New Account</a></b>

Thank you for being part of the <b>Lumière</b> community. We appreciate the time you spent with us and would be happy to welcome you back anytime.

With appreciation,

<b>❤️ The Lumière Team</b>
`,
  newFollower: (
    follower: User,
    followersCount: number,
  ) => ` <b>🎉 You Have a New Follower!</b>

<a href="https://lumiere.com/${follower.username}">${follower.name}</a> has started following your channel.

<b>👥 Total Followers:</b> ${followersCount}

Keep creating great content and growing your community ❤️
`,
  streamStarted: (channel: User) => ` <b>🔴 ${channel.name} is LIVE!</b>

The stream has just started.

🎥 <a href="https://lumiere.com/${channel.username}">Watch Now</a>

Don't miss it 🚀
`,
};
