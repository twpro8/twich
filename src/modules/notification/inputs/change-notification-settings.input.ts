import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@InputType()
export class ChangeNotificationSettingsInput {
  @Field()
  @IsBoolean()
  site: boolean;

  @Field()
  @IsBoolean()
  telegram: boolean;
}
