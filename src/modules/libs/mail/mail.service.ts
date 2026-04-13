import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';
import { EmailVerificationTemplate } from './templates/email-verification.template';
import { PasswordRecoveryTemplate } from './templates/password-recovery.template';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { AccountDeactivationTemplate } from './templates/account-deactivation.template';
import { AccountDeletedTemplate } from './templates/account-deleted.template';

@Injectable()
export class MailService {
  public constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  public async sendVerificationToken(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(EmailVerificationTemplate({ 
      domain,
      token,
      appName: this.configService.getOrThrow<string>('APP_NAME'),
    }));
    return this.sendMail(email, 'Email Verification', html);
  }

  public async sendPasswordRecoveryToken(
    email: string, 
    token: string, 
    metadata: SessionMetadata,
  ) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(PasswordRecoveryTemplate({ 
      domain,
      token,
      appName: this.configService.getOrThrow<string>('APP_NAME'),
      metadata,
    }));
    return this.sendMail(email, 'Password Recovery', html);
  }

  public async sendAccountDeactivationToken(
    email: string, 
    token: string, 
    metadata: SessionMetadata,
  ) {
    const html = await render(AccountDeactivationTemplate({ 
      token,
      appName: this.configService.getOrThrow<string>('APP_NAME'),
      metadata,
    }));
    return this.sendMail(email, 'Account Deactivation', html);
  }

  public async sendAccountDeletedMail(email: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(AccountDeletedTemplate({
      domain,
      appName: this.configService.getOrThrow<string>('APP_NAME'),
    }));
    return this.sendMail(email, 'Account Deleted', html);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
