import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as SchemaType } from 'mongoose';
import { AbstractEntity } from 'src/common/database/entity/abstract.entity';

@Schema({ versionKey: false, timestamps: true, toJSON: { virtuals: true } })
export class Like extends AbstractEntity {
  @Prop({ type: SchemaType.Types.ObjectId, required: true, ref : "User" })
  userId: Types.ObjectId;
  @Prop({ type: SchemaType.Types.ObjectId, required: true, ref : "Post" })
  parentId: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
