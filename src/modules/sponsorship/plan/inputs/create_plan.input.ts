import { Field, InputType, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MinLength,
} from 'class-validator';

@InputType()
export class CreatePlanInput {
  @Field()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;
}
