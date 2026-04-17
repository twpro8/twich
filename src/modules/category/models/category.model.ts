import { Field, ObjectType } from '@nestjs/graphql';
import { StreamModel } from '@/src/modules/stream/models/stream.model';
import { Category } from '@prisma/generated/client';

@ObjectType()
export class CategoryModel implements Category {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field()
  thumbnailUrl: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [StreamModel], { nullable: true })
  streams: StreamModel[] | null;
}
