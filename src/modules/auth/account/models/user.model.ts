import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SocialLinkModel } from '@/src/modules/auth/profile/models/social-link.model';
import { StreamModel } from '@/src/modules/stream/models/stream.model';
import { FollowModel } from '@/src/modules/follow/models/follow.model';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  email: string;

  // @Field(() => String)
  // password: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avatar: string;

  @Field(() => String, { nullable: true })
  bio: string;

  @Field(() => Boolean)
  isVerified: boolean;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field()
  telegramId: string;

  // Relationships
  @Field(() => [SocialLinkModel], { nullable: true })
  socialLinks: SocialLinkModel[] | null;

  @Field(() => StreamModel, { nullable: true })
  stream: StreamModel | null;

  @Field(() => [FollowModel])
  followers: FollowModel[];

  @Field(() => [FollowModel])
  followings: FollowModel[];
}
