import { Notification, NotificationType } from '@prisma/generated/client';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserModel } from '@/src/modules/auth/account/models/user.model';

registerEnumType(NotificationType, { name: 'NotificationType' });

@ObjectType()
export class NotificationModel implements Notification {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  message: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field()
  isRead: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // Relationships
  @Field(() => UserModel)
  user: UserModel;
}
