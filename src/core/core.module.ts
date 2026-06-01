import { getGraphQLConfig } from '@/src/core/config/graphql.config';
import { AccountModule } from '@/src/modules/auth/account/account.module';
import { SessionModule } from '@/src/modules/auth/session/session.module';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DeactivationModule } from '../modules/auth/deactivation/deactivation.module';
import { PasswordRecoveryModule } from '../modules/auth/password-recovery/password-recovery.module';
import { TotpModule } from '../modules/auth/totp/totp.module';
import { VerificationModule } from '../modules/auth/verification/verification.module';
import { CronModule } from '../modules/cron/cron.module';
import { MailModule } from '../modules/libs/mail/mail.module';
import { IS_DEV_ENV } from '../shared/utils/is-dev.util';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { StorageModule } from '@/src/modules/libs/storage/storage.module';
import { ProfileModule } from '@/src/modules/auth/profile/profile.module';
import { StreamModule } from '@/src/modules/stream/stream.module';
import { LivekitModule } from '@/src/modules/libs/livekit/livekit.module';
import { getLiveKitConfig } from '@/src/core/config/livekit.config';
import { IngressModule } from '@/src/modules/stream/ingress/ingress.module';
import { WebhookModule } from '@/src/modules/webhook/webhook.module';
import { CategoryModule } from '@/src/modules/category/category.module';
import { ChatModule } from '@/src/modules/chat/chat.module';
import { FollowModule } from '@/src/modules/follow/follow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
      expandVariables: true,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: getGraphQLConfig,
      inject: [ConfigService],
    }),
    LivekitModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getLiveKitConfig,
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
    MailModule,
    StorageModule,
    CronModule,
    LivekitModule,
    AccountModule,
    ProfileModule,
    SessionModule,
    VerificationModule,
    PasswordRecoveryModule,
    TotpModule,
    DeactivationModule,
    StreamModule,
    IngressModule,
    WebhookModule,
    CategoryModule,
    ChatModule,
    FollowModule,
  ],
})
export class CoreModule {}
