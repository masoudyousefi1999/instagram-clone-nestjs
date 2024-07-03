import {
  Inject,
  Injectable,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { CreatePostInput } from './input/create-post.input';
import { Post } from './entity/post.entity';
import { PostRepository } from './post.repository';
import { Types } from 'mongoose';
import { PaginationInput } from 'src/common/inputs/pagination.input';
import { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/role.enum';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostRepository) private readonly postRepository: PostRepository,
  ) {}

  async addPost(createPostInput: CreatePostInput): Promise<Post> {
    return this.postRepository.createPost(createPostInput);
  }

  async getAllPosts(paginationInput: PaginationInput): Promise<Post[]> {
    const { page, limit } = paginationInput;
    return this.postRepository.getAllPosts(page, limit);
  }

  async getPost(id: string): Promise<Post> {
    const objId = new Types.ObjectId(id);
    return this.postRepository.getPost({ _id: id });
  }

  async deletePost(postId: string, user: User) {
    const objId = new Types.ObjectId(postId);
    const currentProduct = await this.postRepository.getPost({ _id: objId });
    if (
      currentProduct.user._id.toString() == user._id.toString() ||
      user.role === Role.ADMIN
    ) {
      return this.postRepository.deleteDocument({ _id: objId });
    } else {
      throw new UnprocessableEntityException('acces denided.!');
    }
  }

  async archivePost(postId: string, user: User) {
    const objId = new Types.ObjectId(postId);
    const currentProduct = await this.postRepository.getPost({ _id: objId });
    if (
      currentProduct.user._id.toString() == user._id.toString() ||
      user.role === Role.ADMIN
    ) {
      return this.postRepository.archivePost({ _id: postId });
    } else {
      throw new UnprocessableEntityException('acces denided.!');
    }
  }

  async getUserArchivePosts(userId) {
    return this.postRepository.getAllUserArchivePost(userId);
  }
}
