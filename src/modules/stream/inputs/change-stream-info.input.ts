import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangeStreamInfoInput {
  @Field()
  title: string;
}
