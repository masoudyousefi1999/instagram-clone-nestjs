import { Field, ObjectType } from "@nestjs/graphql";
import { AbstractEntity } from "src/common/database/entity/abstract.entity";
import { Like } from "src/like/entity/like.entity";
import { LikeType } from "src/like/type/like.type";
import { User } from "src/user/entity/user.entity";
import { UserType } from "src/user/type/user.type";

@ObjectType()
export class StoryType extends AbstractEntity{
    @Field()
    content : string;
    @Field(type => [LikeType], {nullable : true})
    likes : Like[];
    @Field(type => UserType)
    user: User
}