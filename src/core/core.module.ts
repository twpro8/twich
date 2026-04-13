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
    PrismaModule,
    RedisModule,
    MailModule,
    AccountModule,
    SessionModule,
    VerificationModule,
    PasswordRecoveryModule,
    TotpModule,
    DeactivationModule,
    CronModule,
  ],
})
export class CoreModule {}
