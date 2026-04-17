import {
  Controller,
  HttpCode,
  Post,
  Headers,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('livekit')
  @HttpCode(200)
  async receiveWebhookLivekit(
    @Body() body: string,
    @Headers('Authorization') authorization: string,
  ) {
    if (!authorization) {
      throw new UnauthorizedException();
    }
    return this.webhookService.receiveWebhookLivekit(body, authorization);
  }
}
