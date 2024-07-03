import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/user/type/user.type';

@ObjectType()
export class AuthType {
  @Field()
  token: string;
  @Field((type) => UserType)
  user: UserType;
}
