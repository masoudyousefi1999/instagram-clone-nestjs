import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostType } from './type/post.type';
import { CreatePostInput } from './input/create-post.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from './entity/post.entity';
import { LoginAuthGuard } from 'src/auth/guards/login.guard';
import { PaginationInput } from 'src/common/inputs/pagination.input';
import { Types } from 'mongoose';
import { AddCommentInput } from 'src/comment/input/comment.input';

@Resolver((of) => PostType)
export class PostResolver {
  constructor(@Inject(PostService) private readonly postService: PostService) {}

  @Query((returns) => [PostType], { name: 'posts' })
  async getAllPosts(
    @Args('pagination') paginationInput: PaginationInput,
  ): Promise<Post[]> {
    return this.postService.getAllPosts(paginationInput);
  }

  @Query((returns) => PostType, { name: 'post' })
  async getPost(@Args('postId') postId: string): Promise<Post> {
    return this.postService.getPost(postId);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => PostType)
  async addPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context() context,
  ): Promise<Post> {
    // assinging userId to Post Object
    createPostInput.user = context.req.user._id;
    return this.postService.addPost(createPostInput);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => PostType)
  async deletePost(
    @Args('postId') postId: string,
    @Context() ctx,
  ): Promise<Post> {
    const user = ctx.req.user;
    return this.postService.deletePost(postId, user);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => PostType)
  async archivePost(
    @Args('postId') postId: string,
    @Context() ctx,
  ): Promise<Post> {
    const user = ctx.req.user;
    return this.postService.archivePost(postId, user);
  }

  @UseGuards(LoginAuthGuard)
  @Query((returns) => [PostType])
  async getArchivePosts(@Context() ctx): Promise<Post[]> {
    const userId = ctx.req.user._id;
    return this.postService.getUserArchivePosts(userId);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => String)
  async likePost(
    @Args('postId') postId: string,
    @Context() ctx,
  ): Promise<string> {
    const userId = ctx.req.user._id;
    return this.postService.likePost(postId as any, userId);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => String)
  async dislikePost(
    @Args('postId') postId: string,
    @Context() ctx,
  ): Promise<string> {
    const userId = ctx.req.user._id;
    return this.postService.dislikePost(postId as any, userId);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => String)
  async addComment(
    @Args('addCommentInput') addCommentInput: AddCommentInput,
    @Context() ctx,
  ): Promise<string> {
    addCommentInput.userId = ctx.req.user._id;
    return this.postService.addCommentToPost(addCommentInput);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => String)
  async deleteComment(
    @Args('postId') postId: string,
    @Args('commentId') commentId: string,
    @Context() ctx,
  ): Promise<string> {
    const userId = ctx.req.user._id;
    const postObjId = new Types.ObjectId(postId);
    const commentObjId = new Types.ObjectId(commentId);
    return this.postService.deleteCommentFromPost(
      postObjId,
      commentObjId,
      userId,
    );
  }
}
