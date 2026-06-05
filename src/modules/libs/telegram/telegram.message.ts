import { User } from '@prisma/generated/client';

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
};
