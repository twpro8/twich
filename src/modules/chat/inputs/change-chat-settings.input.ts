import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangeChatSettingsInput {
  @Field()
  isChatEnabled: boolean;

  @Field()
  isChatFollowersOnly: boolean;

  @Field()
  isChatPremiumFollowersOnly: boolean;
}
