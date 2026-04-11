import { IsPasswordMatchingConstraint } from "@/src/shared/decorators/is-password-matching-constraint.decorator";
import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsUUID, MinLength, Validate } from "class-validator";

@InputType()
export class NewPasswordInput {
  @Field(() => String)
  @IsUUID(4)
  @IsNotEmpty()
  token: string;
  
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(6) 
  @Validate(IsPasswordMatchingConstraint)
  confirmPassword: string;
}