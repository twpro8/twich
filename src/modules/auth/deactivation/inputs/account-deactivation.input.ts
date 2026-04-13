import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, Length, MinLength } from 'class-validator';

@InputType()
export class AccountDeactivationInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(6, 6)
  code?: string;
}
