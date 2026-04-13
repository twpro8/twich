import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class EnableTotpInput {
  @Field()
  secret: string;

  @Field()
  @Length(6, 6)
  code: string;
}
