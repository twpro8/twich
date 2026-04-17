import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class ChangeStreamInfoInput {
  @Field()
  title: string;

  @Field()
  @IsUUID()
  categoryId: string;
}
