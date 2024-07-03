import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from 'src/common/database/entity/abstract.entity';
import { Role } from '../role.enum';

@ObjectType()
export class UserType extends AbstractEntity {
  @Field()
  username: string;
  @Field()
  email: string;

  password: string;
  @Field()
  number: string;
  @Field((type) => Role)
  role: Role;
}
