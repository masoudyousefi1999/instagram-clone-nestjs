import { Field, ID, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

@InputType()
export class AddStoryInput {
    @IsString()
    @IsNotEmpty()
    @Field()
    content : string;
    @IsOptional()
    @Field((type) => ID,{nullable : true})
    userId : Types.ObjectId;
}