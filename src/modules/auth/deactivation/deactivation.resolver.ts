import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { DeactivationService } from './deactivation.service';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import type { GqlContext } from '@/src/shared/types/gql-context.types';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@/prisma/generated/client';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import { AccountDeactivationInput } from './inputs/account-deactivation.input';
import { AuthResultModel } from '../account/models/auth.model';

@Resolver('Deactivation')
export class DeactivationResolver {
  public constructor(private readonly deactivationService: DeactivationService) {}

  @Authorization()
  @Mutation(() => AuthResultModel, { name: 'deactivateAccount' })
  public async deactivateAccount(
    @Context() { req }: GqlContext,
    @Authorized() user: User,
    @Args('data') input: AccountDeactivationInput,
    @UserAgent() userAgent: string,
  ) {
    return this.deactivationService.deactivateAccount(req, user, input, userAgent);
  }
}
