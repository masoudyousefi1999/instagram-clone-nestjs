import { AbstractRepository } from 'src/common/database/repository/abstract.repository';
import { User } from './entity/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
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

  async findOneUser(filterQuery: FilterQuery<User>, populateFields?: boolean) {
    const currentUser: User = populateFields
      ? await this.userRepository
          .findOne(filterQuery)
          .populate('followers')
          .populate('followings')
      : await this.userRepository.findOne(filterQuery);

    if (!currentUser) {
      throw new NotFoundException('user not found!.');
    }
    return currentUser;
  }

  async updateUser(
    filterQuery: FilterQuery<User>,
    updateQuery: UpdateQuery<User>,
    populateFields?: boolean,
  ) {
    const currentUser: User = populateFields
      ? await this.userRepository
          .findOneAndUpdate(filterQuery, updateQuery, { new: true })
          .populate('followers')
          .populate('followings')
      : await this.userRepository.findOneAndUpdate(filterQuery, updateQuery, {
          new: true,
        });

    if (!currentUser) {
      throw new NotFoundException('user not found!.');
    }
    return currentUser;
  }
}
