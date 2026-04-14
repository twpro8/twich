import 'express';
import 'express-session';

import { User } from '@/prisma/generated/client';
import { SessionMetadata } from './session-metadata.types';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    createdAt: Date | string;
    metadata: SessionMetadata;
  }
}

declare module 'express' {
  interface Request {
    user?: User | null;
  }
}
