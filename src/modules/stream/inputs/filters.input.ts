import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

@InputType()
export class FiltersInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 1;

  @Field(() => Int, { defaultValue: 5 })
  @IsInt()
  @Min(0)
  skip: number = 5;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  searchTerm?: string;
}
