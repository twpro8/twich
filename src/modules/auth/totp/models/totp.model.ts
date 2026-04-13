import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TotpModel {
  @Field()
  qrCodeUrl: string;

  @Field()
  secret: string;
}
