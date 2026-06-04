import { User } from '@prisma/generated/client';

export const MESSAGES = {
  welcome: 'Welcome',
  authSuccess: 'Authenticated successfully.',
  invalidToken: 'No authorized',
  profile: (user: User) => `Hello, ${user.name}! Your email: ${user.email}`,
};
