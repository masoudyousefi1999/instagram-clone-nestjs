import { AbstractRepository } from 'src/common/database/repository/abstract.repository';
import { Like } from './entity/like.entity';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class LikeRepository extends AbstractRepository<Like> {
  constructor(@InjectModel(Like.name) private readonly LikeModel: Model<Like>) {
    super(LikeModel);
  }

  async deleteManyLikes(filterQuery: FilterQuery<Like>): Promise<Object> {
    try {
      return await this.LikeModel.deleteMany(filterQuery);
    } catch (error) {
      throw new InternalServerErrorException(`ServerSied error : ${error}`);
    }
  }
}
