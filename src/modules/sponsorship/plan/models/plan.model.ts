import { Field, Float, ObjectType } from '@nestjs/graphql';
import { UserModel } from '@/src/modules/auth/account/models/user.model';

@ObjectType()
export class SponsorshipPlanModel {
  @Field()
  id: string;

  @Field()
  stripeProductId: string;

  @Field()
  stripePlanId: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field()
  channelId: string;

  @Field(() => UserModel)
  channel: UserModel;

  // @Field()
  // sponsorshipSubscriptions;
}
