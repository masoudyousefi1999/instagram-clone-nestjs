import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType({isAbstract : true})
export abstract class AbstractEntity {
  @Field(type => ID)
  _id: Types.ObjectId;
}
