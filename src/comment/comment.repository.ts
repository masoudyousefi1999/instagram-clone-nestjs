import { AbstractRepository } from 'src/common/database/repository/abstract.repository';
import { Comment } from './entity/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentRepository extends AbstractRepository<Comment> {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {
    super(commentModel);
  }
}
