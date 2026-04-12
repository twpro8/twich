import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TotpService } from './totp.service';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@/prisma/generated/client';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { TotpModel } from './models/totp.model';
import { EnableTotpInput } from './inputs/enable-totp.input';

@Resolver('Totp')
export class TotpResolver {
  constructor(private readonly totpService: TotpService) {}

  @Authorization()
  @Query(() => TotpModel, { name: 'generateTotpKey' })
  public async generateTotpKey(@Authorized() user: User) {
    return await this.totpService.generateTotpKey(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'enableTotp' })
  public async enableTotp(
    @Authorized() user: User,
    @Args('data') input: EnableTotpInput,
  ) {
    return await this.totpService.enableTotp(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'disableTotp' })
  public async disableTotp(@Authorized() user: User) {
    return await this.totpService.disableTotp(user);
  }
}
