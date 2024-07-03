import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostType } from './type/post.type';
import { CreatePostInput } from './input/create-post.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from './entity/post.entity';
import { LoginAuthGuard } from 'src/auth/guards/login.guard';
import { PaginationInput } from 'src/common/inputs/pagination.input';

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
  async deletePost(@Args('postId') postId: string, @Context() ctx) {
    const user = ctx.req.user;
    return this.postService.deletePost(postId, user);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => PostType)
  async archivePost(@Args('postId') postId: string, @Context() ctx) {
    const user = ctx.req.user;
    return this.postService.archivePost(postId, user);
  }

  @UseGuards(LoginAuthGuard)
  @Query((returns) => [PostType])
  async getArchivePosts(@Context() ctx) {
    const userId = ctx.req.user._id;
    return this.postService.getUserArchivePosts(userId);
  }
}
