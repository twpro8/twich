import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Matches, MaxLength } from 'class-validator';

@InputType()
export class ChangeProfileInfoInput {
  @Field()
  @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
  username: string;

  @Field()
  name: string;

  @Field()
  @IsOptional()
  @MaxLength(255)
  bio?: string;
}
