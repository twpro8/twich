import { Field, ObjectType } from '@nestjs/graphql';
import { Follow } from '@prisma/generated/client';
import { UserModel } from '@/src/modules/auth/account/models/user.model';

@ObjectType()
export class FollowModel implements Follow {
  @Field()
  id: string;

  @Field()
  followerId: string;

  @Field(() => UserModel)
  follower: UserModel;

  @Field()
  followingId: string;

  @Field(() => UserModel)
  following: UserModel;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
