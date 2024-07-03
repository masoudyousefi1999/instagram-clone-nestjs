import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
@ObjectType()
export class CommentType {
  @Field((type) => ID)
  userId: Types.ObjectId;
  @Field()
  message: string;
  @Field((type) => ID)
  postId: Types.ObjectId;
}
