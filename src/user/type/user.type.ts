import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from 'src/common/database/entity/abstract.entity';
import { Role } from '../role.enum';
import { UserPrivacyEnum } from '../user.privacy.enum';

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
  @Field((type) => UserPrivacyEnum)
  privacy?: UserPrivacyEnum;
}
