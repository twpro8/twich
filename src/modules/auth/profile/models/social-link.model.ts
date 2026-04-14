import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SocialLinkModel {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field()
  position: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
