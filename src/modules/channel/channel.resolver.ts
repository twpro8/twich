import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { UserModel } from '@/src/modules/auth/account/models/user.model';

@Resolver('Channel')
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => [UserModel])
  async findRecommendedChannels() {
    return this.channelService.findRecommended();
  }

  @Query(() => UserModel)
  async findChannelByUsername(@Args('username') username: string) {
    return this.channelService.findByUsername(username);
  }

  @Query(() => Number)
  async findFollowersCountByChannelId(@Args('channelId') channelId: string) {
    return this.channelService.findFollowersCountByChannelId(channelId);
  }
}
