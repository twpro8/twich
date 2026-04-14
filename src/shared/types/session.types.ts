import { SessionMetadata } from '@/src/shared/types/session-metadata.types';

export interface Session {
  id: string;
  userId: string;
  createdAt: Date | string;
  metadata: SessionMetadata;
}
