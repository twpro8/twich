import { IsPasswordMatchingConstraint } from '@/src/shared/decorators/is-password-matching-constraint.decorator';
import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, MinLength, Validate } from 'class-validator';

@InputType()
export class NewPasswordInput {
  @Field()
  @IsUUID(4)
  token: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field()
  @MinLength(6)
  @Validate(IsPasswordMatchingConstraint)
  confirmPassword: string;
}
