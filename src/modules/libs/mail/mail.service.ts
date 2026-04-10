import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';
import { EmailVerificationTemplate } from './templates/email-verification.template';

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

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
