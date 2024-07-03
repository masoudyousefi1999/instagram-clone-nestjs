import { Types, Schema as SchemaType } from 'mongoose';
import { AbstractEntity } from 'src/common/database/entity/abstract.entity';
import { Like } from 'src/like/entity/like.entity';
import { PostTypeEnum } from '../post-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Comment } from 'src/comment/entity/comment.entity';
import { User } from 'src/user/entity/user.entity';

@Schema({ versionKey: false, timestamps: true, toJSON: { virtuals: true } })
export class Post extends AbstractEntity {
  @Prop({ required: true, type: SchemaType.Types.ObjectId, ref: "User" })
  user: Types.ObjectId;
  @Prop({ required: true })
  content: string;
  @Prop({ type: SchemaType.Types.ObjectId, ref: Like.name })
  likes: Like[];
  @Prop({ required: true, enum: PostTypeEnum, default: PostTypeEnum.POST })
  type: PostTypeEnum;
  @Prop({ type: SchemaType.Types.ObjectId, ref: Comment.name })
  comments: Comment[];
  @Prop({ required: true, default: '' })
  caption: string;
  @Prop({ type: Boolean, required: false, default: true })
  isActive?: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
