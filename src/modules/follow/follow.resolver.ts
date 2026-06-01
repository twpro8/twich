import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { FollowModel } from '@/src/modules/follow/models/follow.model';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@prisma/generated/client';

@Resolver('Follow')
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Authorization()
  @Query(() => [FollowModel])
  async findMyFollows(@Authorized() user: User) {
    return this.followService.findMyFollows(user);
  }

  @Authorization()
  @Query(() => [FollowModel])
  async findMyFollowers(@Authorized() user: User) {
    return this.followService.findMyFollowers(user);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async follow(@Authorized() user: User, @Args('channelId') channelId: string) {
    return this.followService.follow(user, channelId);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async unfollow(
    @Authorized() user: User,
    @Args('channelId') channelId: string,
  ) {
    return this.followService.unfollow(user, channelId);
  }
}
