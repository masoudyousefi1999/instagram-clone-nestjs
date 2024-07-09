import { Inject, Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { AddCommentInput } from './input/comment.input';
import { FilterQuery, Types } from 'mongoose';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @Inject(CommentRepository)
    private readonly commentrepository: CommentRepository,
  ) {}

  async addComment(commentInput: AddCommentInput): Promise<Comment> {
    const { message, postId, userId } = commentInput;
    console.log('message : ', message);
    console.log('postId : ', postId);
    console.log('userId : ', userId);
    return this.commentrepository.createDocument({ message, postId, userId });
  }

  async deleteComment(commentId: Types.ObjectId): Promise<Comment> {
    return this.commentrepository.deleteDocument({ _id: commentId });
  }

  async deleteComments(filterQuery: FilterQuery<Comment>) : Promise<Object> {
    return this.commentrepository.deleteManyComments(filterQuery);
  }
}
