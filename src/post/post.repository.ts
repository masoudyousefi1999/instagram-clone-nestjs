import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { AbstractRepository } from 'src/common/database/repository/abstract.repository';
import { Post } from './entity/post.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository extends AbstractRepository<Post> {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {
    super(postModel);
  }
  async getAllPosts(page?: number, limit?: number): Promise<Post[]> {
    let skip: number | null;
    if (page && limit) {
      if (page > 1) {
        skip = (page - 1) * limit;
      }
    }
    const posts = await this.postModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('user')
      .populate('likes')
      .populate('comments')
      .skip(skip)
      .limit(limit);
    return posts;
  }

  async getPost(filterQuery: FilterQuery<Post>): Promise<Post> {
    const posts = await this.postModel
      .findOne(filterQuery)
      .populate('user')
      .populate('likes')
      .populate('comments');
    return posts;
  }

  async createPost(post: Omit<Post, '_id'>): Promise<Post> {
    const newPost = await this.postModel.create({
      ...post,
      _id: new Types.ObjectId(),
    });
    return this.getPost({ _id: newPost._id });
  }

  async deletePost(filterQuery: FilterQuery<Post>): Promise<Post> {
    const posts = await this.postModel
      .findOneAndDelete(filterQuery)
      .populate('user')
      .populate('likes')
      .populate('comments');
    return posts;
  }

  async archivePost(filterQuery: FilterQuery<Post>): Promise<Post> {
    const posts = await this.postModel
      .findOneAndUpdate(filterQuery, { isActive: false })
      .populate('user')
      .populate('likes')
      .populate('comments');
    return posts;
  }

  async getAllUserArchivePost(userId) {
    const userArchivedPosts = await this.postModel
      .find({
        user: userId,
        isActive: false,
      })
      .populate('user')
      .populate('likes')
      .populate('comments');
    return userArchivedPosts;
  }
}
