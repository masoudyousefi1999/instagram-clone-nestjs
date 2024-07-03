import { AbstractRepository } from 'src/common/database/repository/abstract.repository';
import { User } from './entity/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from 'src/post/entity/post.entity';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(@InjectModel(User.name) private userRepository: Model<User>) {
    super(userRepository);
  }

  async isFirstUser() {
    const isFirstUser = await this.userRepository.countDocuments();
    if (isFirstUser === 0) {
      return true;
    }
    return false;
  }
}
