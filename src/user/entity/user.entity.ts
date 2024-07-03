import { AbstractEntity } from 'src/common/database/entity/abstract.entity';
import { Role } from '../role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post } from 'src/post/entity/post.entity';

@Schema({ versionKey: false, toJSON: { virtuals: true }, timestamps: true })
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

  posts? : Post[] 
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('posts', {
  ref: Post.name,
  localField: '_id',
  foreignField: 'user',
});
