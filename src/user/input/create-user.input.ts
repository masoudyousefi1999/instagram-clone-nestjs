import { Field, InputType } from '@nestjs/graphql';
import { Role } from '../role.enum';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateUserInput {
  @Transform(({value}) => value.trim() && value.toLowerCase())
  @MaxLength(150)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  @Field()
  username: string;

  @Transform(({value}) => value.toLowerCase())
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsStrongPassword({ minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;

  @MaxLength(11)
  @MinLength(11)
  @IsString()
  @IsNotEmpty()
  @Field()
  number: string;

  @IsEmpty({ message: 'this field is not allowed' })
  role: Role;
}
