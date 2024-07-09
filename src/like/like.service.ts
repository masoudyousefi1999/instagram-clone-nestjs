import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { FilterQuery, Types } from 'mongoose';
import { Like } from './entity/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @Inject(LikeRepository) private readonly likeRepository: LikeRepository,
  ) {}

  async addLike(
    parentId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Like> {
    const like = await this.likeRepository.createDocument({
      parentId,
      userId,
    });
    return like;
  }

  async deleteLike(
    parentId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Like | null> {
    const like = await this.likeRepository.deleteDocument({
      parentId,
      userId,
    });
    return like;
  }

  async deleteLikes(filterQuery: FilterQuery<Like>): Promise<Object> {
    return this.likeRepository.deleteManyLikes(filterQuery);
  }
}
