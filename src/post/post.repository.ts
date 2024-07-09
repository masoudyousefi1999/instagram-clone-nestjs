import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { AbstractRepository } from 'src/common/database/repository/abstract.repository';
import { Post } from './entity/post.entity';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Like } from 'src/like/entity/like.entity';
import { Comment } from 'src/comment/entity/comment.entity';

@Injectable()
export class PostRepository extends AbstractRepository<Post> {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {
    super(postModel);
  }

  async findOnePost(filterQuery: FilterQuery<Post>): Promise<Post> {
    const foundedPost = await this.postModel
      .findOne(filterQuery)
      .populate('user')
      .populate('likes')
      .populate('comments');
    if (!foundedPost) {
      throw new NotFoundException(`cant find post with query : ${filterQuery}`);
    }

    return foundedPost;
  }

  async updatePost(
    filterQuery: FilterQuery<Post>,
    updateQuery: UpdateQuery<Post>,
  ) {
    const updatedPost = this.postModel
      .findOneAndUpdate(filterQuery, updateQuery, { new: true })
      .populate('user')
      .populate('likes')
      .populate('comments');

    if (!updatedPost) {
      throw new UnprocessableEntityException(
        'cant update post please try again.',
      );
    }
    return updatedPost;
  }

  async getAllPosts(
    filterQuery: FilterQuery<Post>,
    skip?: number | null,
    limit?: number | null,
  ): Promise<Post[]> {
    const posts = await this.postModel
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .populate('user')
      .populate('likes')
      .populate('comments')
      .skip(skip)
      .limit(limit)
      .lean()
      .populate({ path: 'comments', model: Comment.name })
      .populate({ path: 'likes', model: Like.name })
      .exec();
    console.log(posts);
    return posts;
  }

  async createPost(post: Omit<Post, '_id'>): Promise<Post> {
    const newPost = await this.createDocument({ ...post });
    return this.findOnePost({ _id: newPost._id });
  }

  async deletePost(filterQuery: FilterQuery<Post>): Promise<Post> {
    const posts = await this.postModel
      .findOneAndDelete(filterQuery)
      .populate('user')
      .populate('likes')
      .populate('comments');
    return posts;
  }
}
