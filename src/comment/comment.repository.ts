import { AbstractRepository } from 'src/common/database/repository/abstract.repository';
import { Comment } from './entity/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { AddCommentInput } from './input/comment.input';

@Injectable()
export class CommentRepository extends AbstractRepository<Comment> {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {
    super(commentModel);
  }

  async deleteManyComments(filterQuery: FilterQuery<Comment>): Promise<Object> {
    return await this.commentModel.deleteMany(filterQuery);
  }

}
