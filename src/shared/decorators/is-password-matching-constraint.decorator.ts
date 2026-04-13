import { NewPasswordInput } from '@/src/modules/auth/password-recovery/inputs/new-password.input';
import {
  ValidatorConstraint,
  type ValidationArguments,
  type ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
  public validate(confirmPassword: string, args: ValidationArguments) {
    const obj = args.object as NewPasswordInput;
    return obj.password === confirmPassword;
  }

  public defaultMessage(ValidationArguments?: ValidationArguments) {
    return 'Passwords do not match';
  }
}
