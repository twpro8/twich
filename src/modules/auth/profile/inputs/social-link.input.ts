import { Field, InputType } from '@nestjs/graphql';
import { IsUrl, IsUUID } from 'class-validator';

@InputType()
export class SocialLinkInput {
  @Field()
  name: string;

  @Field()
  @IsUrl()
  url: string;
}

@InputType()
export class ChangeSocialLinksOrderInput {
  @Field()
  @IsUUID()
  id: string;

  @Field()
  position: number;
}
