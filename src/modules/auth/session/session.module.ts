import { RedisModule } from '@/src/core/redis/redis.module';
import { Module } from '@nestjs/common';
import { VerificationService } from '../verification/verification.service';
import { SessionResolver } from './session.resolver';
import { SessionService } from './session.service';

@Module({
  imports: [RedisModule],
  providers: [SessionResolver, SessionService, VerificationService],
})
export class SessionModule {}
