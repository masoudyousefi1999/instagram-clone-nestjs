import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
@InputType()
export class AddCommentInput {
  @IsEmpty()
  @Field((type) => ID, {nullable : true})
  userId: Types.ObjectId;
  @IsString()
  @IsNotEmpty()
  @Field()
  message: string;

  @IsString()
  @IsNotEmpty()
  @Field((type) => ID)
  postId: Types.ObjectId;
}
