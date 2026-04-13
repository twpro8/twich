import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  login: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(6, 6)
  code?: string;
}
