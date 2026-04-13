import type { User } from '@/prisma/generated/client';
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input';
import { UserModel } from '@/src/modules/auth/account/models/user.model';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { ChangeEmailInput } from './inputs/change-email.input';
import { ChangePasswordInput } from './inputs/change-password.input';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Authorization()
  @Query(() => UserModel)
  async me(@Authorized('id') id: string) {
    return this.accountService.me(id);
  }

  @Mutation(() => Boolean)
  async createUser(@Args('data') input: CreateUserInput) {
    return this.accountService.create(input);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async changeEmail(
    @Authorized() user: User,
    @Args('data') input: ChangeEmailInput,
  ) {
    return this.accountService.changeEmail(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async changePassword(
    @Authorized() user: User,
    @Args('data') input: ChangePasswordInput,
  ) {
    return this.accountService.changePassword(user, input);
  }
}
