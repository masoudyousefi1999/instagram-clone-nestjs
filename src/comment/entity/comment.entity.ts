import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as SchemaType } from 'mongoose';
import { AbstractEntity } from 'src/common/database/entity/abstract.entity';

@Schema({ versionKey: false, timestamps: true, toJSON: { virtuals: true } })
export class Comment extends AbstractEntity {
  @Prop({ required: true, type: SchemaType.Types.ObjectId })
  userId: Types.ObjectId;
  @Prop({ required: true, type: SchemaType.Types.ObjectId })
  message: string;
  @Prop({ required: true, type: SchemaType.Types.ObjectId })
  postId: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
