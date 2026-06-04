import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { ChangeNotificationSettingsInput } from '@/src/modules/notification/inputs/change-notification-settings.input';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@prisma/generated/client';
import { ChangeNotificationSettingsResponse } from '@/src/modules/notification/models/notification-settings.model';
import { NotificationModel } from '@/src/modules/notification/models/notification.model';

@Resolver('Notification')
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Authorization()
  @Query(() => Number)
  async findUnreadCount(@Authorized() user: User) {
    return this.notificationService.findUnreadCount(user);
  }

  @Authorization()
  @Query(() => [NotificationModel])
  async findByUser(@Authorized() user: User) {
    return this.notificationService.findByUser(user);
  }

  @Authorization()
  @Mutation(() => ChangeNotificationSettingsResponse)
  async changeSettings(
    @Authorized() user: User,
    @Args('data') input: ChangeNotificationSettingsInput,
  ) {
    return this.notificationService.changeSettings(user, input);
  }
}
