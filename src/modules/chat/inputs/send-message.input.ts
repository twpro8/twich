import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, MaxLength } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field()
  @IsUUID()
  streamId: string;

  @Field()
  @MaxLength(255)
  text: string;
}
