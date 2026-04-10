import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { MailModule } from '../../libs/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}
