import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

@InputType()
export class AccountDeactivationInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code?: string;
}
