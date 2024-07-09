import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/post/entity/post.entity';
import { PostType } from 'src/post/type/post.type';
import { User } from 'src/user/entity/user.entity';
import { UserType } from 'src/user/type/user.type';

@ObjectType()
export class LikeType {
  @Field((type) => UserType)
  user: User;
  @Field((type) => PostType)
  post: Post;
}
