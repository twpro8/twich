import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { PubSub } from 'graphql-subscriptions';
import { ChatMessageModel } from '@/src/modules/chat/models/chat-message.model';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@prisma/generated/client';
import { ChangeChatSettingsInput } from '@/src/modules/chat/inputs/change-chat-settings.input';
import { SendMessageInput } from '@/src/modules/chat/inputs/send-message.input';

const pubSub = new PubSub();

@Resolver('Chat')
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => [ChatMessageModel])
  async findMessagesByStream(@Args('streamId') streamId: string) {
    return this.chatService.findMessagesByStream(streamId);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async changeChatSettings(
    @Authorized() user: User,
    @Args('data') input: ChangeChatSettingsInput,
  ) {
    return this.chatService.changeChatSettings(user, input);
  }

  @Authorization()
  @Mutation(() => ChatMessageModel)
  async sendChatMessage(
    @Authorized() user: User,
    @Args('data') input: SendMessageInput,
  ) {
    const message = await this.chatService.sendMessage(user, input);
    await pubSub.publish('CHAT_MESSAGE_ADDED', {
      chatMessageAdded: message,
    });
    return message;
  }

  @Subscription(() => ChatMessageModel, {
    filter: (payload, variables) =>
      payload.chatMessageAdded.streamId === variables.streamId,
  })
  chatMessageAdded(@Args('streamId') streamId: string) {
    return pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED');
  }
}
