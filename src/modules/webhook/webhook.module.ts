import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { NotificationService } from '@/src/modules/notification/notification.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, NotificationService],
})
export class WebhookModule {}
