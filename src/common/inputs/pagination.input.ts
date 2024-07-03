import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

@InputType()
export class PaginationInput {
  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Field((type) => Number, { nullable: true })
  limit?: number;
  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Field((type) => Number, { nullable: true })
  page?: number;
}
