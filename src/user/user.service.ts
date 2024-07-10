import {
  BadRequestException,
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
import { UserPrivacyEnum } from './user.privacy.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  isUserIdEqual(
    currentUserId: Types.ObjectId,
    targetUserId: Types.ObjectId,
  ): null | BadRequestException {
    if (currentUserId.toString() === targetUserId.toString()) {
      throw new BadRequestException('your id and target id cannot be same.');
    }
    return null;
  }

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

  async changeUserPrivacy(userId: Types.ObjectId) {
    const currentUser = await this.userRepository.findOneUser({ _id: userId });
    const privacy =
      currentUser.privacy === UserPrivacyEnum.PUBLIC
        ? UserPrivacyEnum.PRIVATE
        : UserPrivacyEnum.PUBLIC;
    return await this.userRepository.updateUser(
      { _id: userId },
      { privacy },
      true,
    );
  }

  async follow(
    currentUserId: Types.ObjectId,
    targetUserId: Types.ObjectId,
  ): Promise<User | string> {
    this.isUserIdEqual(currentUserId, targetUserId);
    const currentUser = await this.userRepository.findOneUser({
      _id: currentUserId,
    });
    const isUserFollowtargetBefore = currentUser.followings.findIndex(
      (followerId) => followerId.toString() === targetUserId.toString(),
    );
    if (isUserFollowtargetBefore !== -1) {
      throw new UnprocessableEntityException('you follow this user before.');
    }
    const targetUser = await this.userRepository.findOneUser({
      _id: targetUserId,
    });

    if (targetUser.privacy === UserPrivacyEnum.PUBLIC) {
      await this.userRepository.updateUser(
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
      return 'followed successfully';
    }

    await this.userRepository.updateUser(
      { _id: targetUserId },
      { $push: { requests: currentUserId } },
    );
    return 'follow request sent.';
  }

  async acceptFollowRequest(
    currentUserId: Types.ObjectId,
    targetUserId: Types.ObjectId,
  ) {
    this.isUserIdEqual(currentUserId, targetUserId);
    const currentUser = await this.userRepository.findOneUser({
      _id: currentUserId,
    });
    const filtredRequests = currentUser.requests.filter(
      (requestId) => requestId.toString() !== targetUserId.toString(),
    );
    if (filtredRequests.length === currentUser.requests.length) {
      throw new BadRequestException("this user not send you a request.")
    }
    await this.userRepository.updateUser(
      { _id: currentUserId },
      {
        requests: filtredRequests,
        $push: { followers: targetUserId },
      },
      true,
    );
    await this.userRepository.updateUser(
      { _id: targetUserId },
      {
        $push: { followings: currentUserId },
      },
    );

    return 'follow request accepted successfully';
  }

  async unFollow(currentUserId: Types.ObjectId, targetUserId: Types.ObjectId) {
    this.isUserIdEqual(currentUserId, targetUserId);
    const currentUser = await this.userRepository.findOneUser({
      _id: currentUserId,
    });
    const filtredFollowingsList = currentUser.followings.filter(
      (followerId) => followerId.toString() !== targetUserId.toString(),
    );
    if (filtredFollowingsList.length === currentUser.followings.length) {
      throw new UnprocessableEntityException(
        "you cant unfollow this user because you diden't follow him :) .",
      );
    }
    const targetUser = await this.userRepository.findOneUser({
      _id: targetUserId,
    });
    const filtredTargetFollowersList = targetUser.followers.filter(
      (followerId) => followerId.toString() !== currentUserId.toString(),
    );
    await this.userRepository.updateUser(
      { _id: targetUserId },
      { followers: filtredTargetFollowersList },
      true,
    );
    await this.userRepository.updateUser(
      { _id: currentUserId },
      { followings: filtredFollowingsList },
    );
    return "unfollow successfully.";
  }
}
