import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, type FileUpload } from 'graphql-upload-ts';
import { ProfileService } from './profile.service';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@prisma/generated/client';
import { ChangeProfileInfoInput } from '@/src/modules/auth/profile/inputs/change-info.input';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';
import {
  ChangeSocialLinksOrderInput,
  SocialLinkInput,
} from '@/src/modules/auth/profile/inputs/social-link.input';
import { SocialLinkModel } from '@/src/modules/auth/profile/models/social-link.model';

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

  @Authorization()
  @Query(() => [SocialLinkModel])
  async findSocialLinks(@Authorized() user: User) {
    return this.profileService.findSocialLinks(user);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async createSocialLink(
    @Authorized() user: User,
    @Args('data') input: SocialLinkInput,
  ) {
    return this.profileService.createSocialLink(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async updateSocialLink(
    @Authorized() user: User,
    @Args('id') id: string,
    @Args('data') input: SocialLinkInput,
  ) {
    return this.profileService.updateSocialLink(user, id, input);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async reorderSocialLinks(
    @Authorized() user: User,
    @Args('data', { type: () => [ChangeSocialLinksOrderInput] })
    input: ChangeSocialLinksOrderInput[],
  ) {
    return this.profileService.reorderSocialLinks(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async deleteSocialLink(@Authorized() user: User, @Args('id') id: string) {
    return this.profileService.deleteSocialLink(user, id);
  }
}
