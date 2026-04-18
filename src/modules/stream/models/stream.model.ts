import { Field, ObjectType } from '@nestjs/graphql';
import { Stream } from '@prisma/generated/client';
import { UserModel } from '@/src/modules/auth/account/models/user.model';
import { CategoryModel } from '@/src/modules/category/models/category.model';
import { ChatMessageModel } from '@/src/modules/chat/models/chat-message.model';

@ObjectType()
export class StreamModel implements Stream {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  userId: string | null;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  thumbnailUrl: string | null;

  @Field(() => String, { nullable: true })
  ingressId: string | null;

  @Field(() => String, { nullable: true })
  serverUrl: string | null;

  @Field(() => String, { nullable: true })
  streamKey: string | null;

  @Field()
  isLive: boolean;

  @Field(() => String, { nullable: true })
  categoryId: string | null;

  @Field(() => CategoryModel, { nullable: true })
  category: CategoryModel | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => UserModel)
  user: UserModel;

  @Field()
  isChatEnabled: boolean;

  @Field()
  isChatFollowersOnly: boolean;

  @Field()
  isChatPremiumFollowersOnly: boolean;

  @Field(() => [ChatMessageModel])
  chatMessages: ChatMessageModel[];
}
