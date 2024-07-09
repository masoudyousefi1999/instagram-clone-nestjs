import { AbstractRepository } from 'src/common/database/repository/abstract.repository';
import { Story } from './entity/stroy.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export class StoryRepository extends AbstractRepository<Story> {
  constructor(
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
  ) {
    super(storyModel);
  }

  async findOneStory(filterQuery: FilterQuery<Story>) {
    const currentStory = await this.storyModel
      .findOne(filterQuery)
      .populate('userId')
      .populate('likes');
    return currentStory;
  }

  async updateStory(filterQuery : FilterQuery<Story>, updateQuery : UpdateQuery<Story>){
    const currentStory = await this.storyModel
      .findOneAndUpdate(filterQuery,updateQuery)
      .populate('userId')
      .populate('likes');
    return currentStory;
  }
}
