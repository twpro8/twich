import { Field, ObjectType } from '@nestjs/graphql';
import type { NotificationSettings } from '@prisma/generated/client';
import { UserModel } from '@/src/modules/auth/account/models/user.model';

@ObjectType()
export class NotificationSettingsModel implements NotificationSettings {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  site: boolean;

  @Field()
  telegram: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // Relationships
  @Field(() => UserModel)
  user: UserModel;
}

@ObjectType()
export class ChangeNotificationSettingsResponse {
  @Field(() => NotificationSettingsModel)
  settings: NotificationSettingsModel;

  @Field({ nullable: true })
  telegramAuthToken?: string;
}
