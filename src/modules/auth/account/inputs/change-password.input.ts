import { Field, InputType } from "@nestjs/graphql";
import { MinLength } from "class-validator";

@InputType()
export class ChangePasswordInput {
  @Field()
  @MinLength(6)
  password: string;

  @Field()
  @MinLength(6)
  newPassword: string;
}
