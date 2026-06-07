import { type DynamicModule, Module } from '@nestjs/common';
import {
  StripeOptionsSymbol,
  type TypeStripeAsyncOptions,
  type TypeStripeOptions,
} from '@/src/modules/libs/stripe/types/stripe.type';
import { StripeService } from '@/src/modules/libs/stripe/stripe.service';

@Module({})
export class StripeModule {
  static register(options: TypeStripeOptions): DynamicModule {
    return {
      module: StripeModule,
      providers: [
        {
          provide: StripeOptionsSymbol,
          useValue: options,
        },
        StripeService,
      ],
      exports: [StripeService],
      global: true,
    };
  }

  static registerAsync(options: TypeStripeAsyncOptions): DynamicModule {
    return {
      module: StripeModule,
      imports: options.imports || [],
      providers: [
        {
          provide: StripeOptionsSymbol,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        StripeService,
      ],
      exports: [StripeService],
      global: true,
    };
  }
}
