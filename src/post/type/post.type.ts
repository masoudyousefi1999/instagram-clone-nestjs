import { PostTypeEnum } from '../post-type.enum';
import { UserType } from 'src/user/type/user.type';
import { LikeType } from 'src/like/type/like.type';
import { CommentType } from 'src/comment/type/comment.type';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from 'src/common/database/entity/abstract.entity';

@ObjectType()
export class PostType extends AbstractEntity{
  @Field((type) => UserType)
  user: UserType;
  @Field()
  content: string;
  @Field((type) => LikeType,{nullable : true})
  likes: LikeType[];
  @Field((type) => PostTypeEnum)
  type: PostTypeEnum;
  @Field((type) => [CommentType],{nullable : true})
  comments: CommentType[];
  @Field()
  caption: string;
}
