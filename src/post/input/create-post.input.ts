import { Like } from 'src/like/entity/like.entity';
import { Types } from 'mongoose';
import { Field, ID, InputType } from '@nestjs/graphql';
import { PostTypeEnum } from '../post-type.enum';
import { IsNotEmpty, IsString } from 'class-validator';
import { Comment } from 'src/comment/entity/comment.entity';

@InputType()
export class CreatePostInput {
  user: Types.ObjectId;
  @IsString()
  @IsNotEmpty()
  @Field()
  content: string;
  @Field((type) => PostTypeEnum, { nullable: true })
  type: PostTypeEnum;
  @IsNotEmpty()
  @IsString()
  @Field()
  caption: string;

  comments: Comment[];
  likes: Like[];
}
