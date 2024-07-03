import { registerEnumType } from "@nestjs/graphql";

export enum PostTypeEnum {
    POST = "POST",
    RELL = "REEL"
}

registerEnumType(PostTypeEnum,{name : "PostTypeEnum"})