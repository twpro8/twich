import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { VerificationService } from './verification.service';
import type { GqlContext } from '@/src/shared/types/gql-context.types';
import { VerificationInput } from './inputs/verification.input';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import { UserModel } from '../account/models/user.model';

@Resolver('Verification')
export class VerificationResolver {
  public constructor(private readonly verificationService: VerificationService) {}

  @Mutation(() => UserModel, { name: 'verifyEmail' })
  public async verifyEmail(
    @Context() { req }: GqlContext,
    @Args('data') input: VerificationInput,
    @UserAgent() userAgent: string,
  ) {
    return await this.verificationService.verifyEmail(req, input, userAgent);
  }
}
