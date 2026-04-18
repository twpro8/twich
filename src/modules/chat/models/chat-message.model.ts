import { Field, ObjectType } from '@nestjs/graphql';
import { ChatMessage } from '@prisma/generated/client';
import { UserModel } from '@/src/modules/auth/account/models/user.model';
import { StreamModel } from '@/src/modules/stream/models/stream.model';

@ObjectType()
export class ChatMessageModel implements ChatMessage {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  streamId: string;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => StreamModel)
  stream: StreamModel;
}
