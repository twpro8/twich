import { Field, ObjectType } from '@nestjs/graphql';
import type { Stream } from '@prisma/generated/client';
import { UserModel } from '@/src/modules/auth/account/models/user.model';

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => UserModel)
  user: UserModel;
}
