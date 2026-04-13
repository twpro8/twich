import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Matches, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;
}
