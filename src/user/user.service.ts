import {
  Inject,
  Injectable,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entity/user.entity';
import { CreateUserInput } from './input/create-user.input';
import { Role } from './role.enum';
import { hash } from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAllDocuments();
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const userIsFirst = await this.userRepository.isFirstUser();
    // assigning role to first user Entity
    userIsFirst
      ? (createUserInput.role = Role.ADMIN)
      : (createUserInput.role = Role.USER);
    const hashedpassword = await hash(createUserInput.password, 12);
    createUserInput.password = hashedpassword;

    const user = await this.userRepository.createDocument(createUserInput);
    return user;
  }

  async findUser(filterQuery: FilterQuery<User>, select?): Promise<User> {
    return this.userRepository.findOndeDocument(filterQuery, select);
  }

  async updateUser(
    id: string | Types.ObjectId,
    updateQuery: UpdateQuery<User>,
  ): Promise<User> {
    return this.userRepository.updateDocument({ _id: id }, updateQuery);
  }

  async deleteUser(id: string): Promise<User> {
    return this.userRepository.deleteDocument({ _id: id });
  }

  async follow(
    currentUserId: Types.ObjectId,
    targetUserId: Types.ObjectId,
  ): Promise<User> {
    const currentUser = await this.userRepository.findOneUser({
      _id: currentUserId,
    });
    const isUserFollowtargetBefore = currentUser.followings.findIndex(
      (followerId) => followerId.toString() === targetUserId.toString(),
    );
    if (isUserFollowtargetBefore !== -1) {
      throw new UnprocessableEntityException('you follow this user before.');
    }
    const updatedUser = await this.userRepository.updateUser(
      { _id: currentUserId },
      {
        $push: { followings: targetUserId },
      },
      true,
    );
    await this.userRepository.updateUser(
      { _id: targetUserId },
      {
        $push: { followers: currentUserId },
      },
    );
    return updatedUser;
  }

  async unFollow(currentUserId: Types.ObjectId, targetUserId: Types.ObjectId) {
    const currentUser = await this.userRepository.findOneUser({
      _id: currentUserId,
    });
    const isUserFollowtargetBefore = currentUser.followings.filter(
      (followerId) => followerId.toString() !== targetUserId.toString(),
    );
    if (isUserFollowtargetBefore.length === currentUser.followings.length) {
      throw new UnprocessableEntityException(
        'you cant unfollow this user because you diden\'t follow him :) .',
      );
    }
    const targetUser = await this.userRepository.findOneUser({
      _id: targetUserId,
    });
    const newFollowwingList = targetUser.followers.filter(
      (followerId) => followerId.toString() !== currentUserId.toString(),
    );
    const updatedUser = await this.userRepository.updateUser(
      { _id: currentUserId },
      { followings: isUserFollowtargetBefore },
    );
    await this.userRepository.updateUser(
      { _id: targetUserId },
      { followers: newFollowwingList },
      true,
    );
    return updatedUser;
  }
}
