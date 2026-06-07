import type { TypeStripeOptions } from '@/src/modules/libs/stripe/types/stripe.type';
import { ConfigService } from '@nestjs/config';

export function getStripeConfig(
  configService: ConfigService,
): TypeStripeOptions {
  return {
    apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    config: {
      apiVersion: '2026-05-27.dahlia',
    },
  };
}
