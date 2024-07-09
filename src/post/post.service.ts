import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePostInput } from './input/create-post.input';
import { Post } from './entity/post.entity';
import { PostRepository } from './post.repository';
import { Types } from 'mongoose';
import { PaginationInput } from 'src/common/inputs/pagination.input';
import { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/role.enum';
import { LikeService } from 'src/like/like.service';
import { AddCommentInput } from 'src/comment/input/comment.input';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostRepository) private readonly postRepository: PostRepository,
    @Inject(LikeService) private readonly likeService: LikeService,
    @Inject(CommentService) private readonly commentService: CommentService,
  ) {}

  async addPost(createPostInput: CreatePostInput): Promise<Post> {
    return this.postRepository.createPost(createPostInput);
  }

  async getAllPosts(paginationInput: PaginationInput): Promise<Post[]> {
    const { page, limit } = paginationInput;
    let skip: number | null;
    if (page && limit) {
      if (page > 1) {
        skip = (page - 1) * limit;
      }
    }
    return this.postRepository.getAllPosts({ isActive: true }, page, skip);
  }

  async getPost(id: string): Promise<Post> {
    return this.postRepository.findOnePost({ _id: id });
  }

  async deletePost(postId: string, user: User): Promise<Post> {
    const objId = new Types.ObjectId(postId);
    const currentProduct = await this.postRepository.findOnePost({
      _id: objId,
    });
    if (
      currentProduct.user._id.toString() == user._id.toString() ||
      user.role === Role.ADMIN
    ) {
      await this.likeService.deleteLikes({ post: postId });
      await this.commentService.deleteComments({ postId: postId });
      return this.postRepository.deletePost({ _id: objId });
    } else {
      throw new UnprocessableEntityException('acces denided.!');
    }
  }

  async archivePost(postId: string, user: User): Promise<Post> {
    const objId = new Types.ObjectId(postId);
    const currentProduct = await this.postRepository.findOnePost({
      _id: objId,
    });
    if (
      currentProduct.user._id.toString() == user._id.toString() ||
      user.role === Role.ADMIN
    ) {
      return this.postRepository.updatePost(
        { _id: postId },
        { isActive: false },
      );
    } else {
      throw new UnprocessableEntityException('acces denided.!');
    }
  }

  async getUserArchivePosts(userId): Promise<Post[]> {
    return this.postRepository.getAllPosts({ isActive: false, user: userId });
  }

  async likePost(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<string> {
    const currentPost = await this.postRepository.findOnePost({ _id: postId });
    const isUserLikePostBefore = currentPost.likes.findIndex(
      (like) => like.userId.toString() === userId.toString(),
    );
    if (!(isUserLikePostBefore === -1)) {
      throw new UnprocessableEntityException('you like this post before!.');
    }
    const like = await this.likeService.addLike(postId, userId);
    await this.postRepository.updatePost(
      { _id: postId },
      { $push: { likes: like._id } },
    );
    return 'post liked successfully.';
  }

  async dislikePost(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<string> {
    const currentPost = await this.postRepository.findOnePost({ _id: postId });
    const filtredLikes = currentPost.likes.filter(
      (like) => like.userId.toString() !== userId.toString(),
    );
    if (!(filtredLikes.length === filtredLikes.length)) {
      throw new UnprocessableEntityException(
        "user didn't like this post before!.",
      );
    }
    await this.likeService.deleteLike(postId, userId);
    await this.postRepository.updatePost(
      { _id: postId },
      { likes: filtredLikes },
    );
    return 'post disliked successfully';
  }

  async addCommentToPost(addCommentInput: AddCommentInput) {
    const { postId, userId } = addCommentInput;
    await this.postRepository.findOnePost({_id : postId})
    const comment = await this.commentService.addComment(addCommentInput);
    await this.postRepository.updatePost(
      { _id: postId, user: userId },
      { $push: { comments: comment._id } },
    );
    return 'comment added Successfully.';
  }

  async deleteCommentFromPost(
    postId: Types.ObjectId,
    commentId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    const currentPost = await this.postRepository.findOnePost({
      post: postId,
      user: userId,
      isActive: true,
    });
    const filtredComments = currentPost.comments.filter(
      (comment) => comment._id.toString() !== commentId.toString(),
    );
    if (currentPost.comments.length === filtredComments.length) {
      throw new UnprocessableEntityException('comment not found.');
    }
    await this.commentService.deleteComment(commentId);
    await this.postRepository.updatePost(
      { _id: postId, user: userId },
      { comments: filtredComments },
    );
    return 'comment deleted Successfully.';
  }
}
