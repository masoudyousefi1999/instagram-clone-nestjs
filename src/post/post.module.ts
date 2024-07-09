import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PostRepository } from './post.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entity/post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { LikeModule } from 'src/like/like.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    LikeModule,
    CommentModule,
  ],
  providers: [PostService, PostResolver, PostRepository],
})
export class PostModule {}
