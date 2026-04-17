import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GenerateStreamTokenInput {
  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsUUID()
  channelId: string;
}
