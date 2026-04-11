import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string
}