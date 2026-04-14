import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, type FileUpload } from 'graphql-upload-ts';
import { ProfileService } from './profile.service';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@prisma/generated/client';
import { ChangeProfileInfoInput } from '@/src/modules/auth/profile/inputs/change-info.input';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';

@Resolver('Profile')
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Authorization()
  @Mutation(() => Boolean)
  async changeAvatar(
    @Authorized() user: User,
    @Args({ name: 'avatar', type: () => GraphQLUpload }, FileValidationPipe)
    avatar: Promise<FileUpload>,
  ) {
    return this.profileService.changeAvatar(user, avatar);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async removeAvatar(@Authorized() user: User) {
    return this.profileService.removeAvatar(user);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async changeProfileInfo(
    @Authorized() user: User,
    @Args('data') input: ChangeProfileInfoInput,
  ) {
    return this.profileService.changeProfileInfo(user, input);
  }
}
