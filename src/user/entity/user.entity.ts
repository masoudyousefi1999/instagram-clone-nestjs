import { AbstractEntity } from 'src/common/database/entity/abstract.entity';
import { Role } from '../role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post } from 'src/post/entity/post.entity';
import { Story } from 'src/story/entity/stroy.entity';
import { Schema as SchemaType, Types } from 'mongoose';
@Schema({
  versionKey: false,
  toJSON: { virtuals: true },
  timestamps: true,
  strict: false,
})
export class User extends AbstractEntity {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, unique: true })
  number: string;

  @Prop({ required: true, enum: Role })
  role?: Role;
  @Prop([{ type: SchemaType.Types.ObjectId, ref: 'User', default: [] }])
  followers?: User[] | Types.ObjectId[];
  @Prop([{ type: SchemaType.Types.ObjectId, ref: 'User', default: [] }])
  followings?: User[] | Types.ObjectId[];

  posts?: Post[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('posts', {
  ref: Post.name,
  localField: '_id',
  foreignField: 'user',
});

UserSchema.virtual('stories', {
  ref: Story.name,
  localField: '_id',
  foreignField: 'userId',
});
