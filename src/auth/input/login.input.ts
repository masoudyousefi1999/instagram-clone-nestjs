import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

@InputType()
export class LoginInput {
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  @Field()
  identifire: string;

  @IsStrongPassword({ minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
}
