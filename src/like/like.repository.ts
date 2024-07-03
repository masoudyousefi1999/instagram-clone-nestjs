import { AbstractRepository } from 'src/common/database/repository/abstract.repository';
import { Like } from './entity/like.entity';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikeRepository extends AbstractRepository<Like> {
  constructor(@InjectModel(Like.name) private readonly LikeModel: Model<Like>) {
    super(LikeModel);
  }
}
