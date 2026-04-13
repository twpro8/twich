import type { User } from '@/prisma/generated/client';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import type { GqlContext } from '@/src/shared/types/gql-context.types';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthResultModel } from '../account/models/auth.model';
import { DeactivationService } from './deactivation.service';
import { AccountDeactivationInput } from './inputs/account-deactivation.input';

@Resolver('Deactivation')
export class DeactivationResolver {
  constructor(private readonly deactivationService: DeactivationService) {}

  @Authorization()
  @Mutation(() => AuthResultModel, { name: 'deactivateAccount' })
  async deactivateAccount(
    @Context() { req }: GqlContext,
    @Authorized() user: User,
    @Args('data') input: AccountDeactivationInput,
    @UserAgent() userAgent: string,
  ) {
    return this.deactivationService.deactivateAccount(
      req,
      user,
      input,
      userAgent,
    );
  }
}
