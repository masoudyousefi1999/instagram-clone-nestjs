import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractEntity } from "src/common/database/entity/abstract.entity";
import { Like } from "src/like/entity/like.entity";
import { Schema as SchemaType } from "mongoose";

@Schema({versionKey : false, timestamps : true, toJSON : {virtuals : true}, toObject : {virtuals : true}})
export class Story extends AbstractEntity {
    @Prop({required : true})
    content : string;
    @Prop({required : true, type : SchemaType.Types.ObjectId, ref : "User"})
    userId : Types.ObjectId;
    @Prop([{type :SchemaType.Types.ObjectId, ref : "Like", default : [] }])
    likes? : Like[];
}

export const StorySchema = SchemaFactory.createForClass(Story);