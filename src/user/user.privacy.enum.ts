import { registerEnumType } from "@nestjs/graphql";

export enum UserPrivacyEnum {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}

registerEnumType(UserPrivacyEnum,{name : "UserPrivacyEnum"})