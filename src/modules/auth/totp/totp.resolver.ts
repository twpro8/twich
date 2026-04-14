import type { User } from '@/prisma/generated/client';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EnableTotpInput } from './inputs/enable-totp.input';
import { TotpModel } from './models/totp.model';
import { TotpService } from './totp.service';

@Resolver('Totp')
export class TotpResolver {
  constructor(private readonly totpService: TotpService) {}

  @Authorization()
  @Query(() => TotpModel, { name: 'generateTotpKey' })
  async generateTotpKey(@Authorized() user: User) {
    return this.totpService.generateTotpKey(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'enableTotp' })
  async enableTotp(
    @Authorized() user: User,
    @Args('data') input: EnableTotpInput,
  ) {
    return this.totpService.enableTotp(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'disableTotp' })
  async disableTotp(@Authorized() user: User) {
    return this.totpService.disableTotp(user);
  }
}
