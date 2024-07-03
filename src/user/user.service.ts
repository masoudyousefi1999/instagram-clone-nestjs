import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entity/user.entity';
import { CreateUserInput } from './input/create-user.input';
import { Role } from './role.enum';
import { hash } from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { Post } from 'src/post/entity/post.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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
    // hash password
    const hashedpassword = await hash(createUserInput.password, 12);
    createUserInput.password = hashedpassword;

    const user = await this.userRepository.createDocument(createUserInput);
    return user;
  }

  async findUser(filterQuery: FilterQuery<User>, select?) : Promise<User> {
    return this.userRepository.findOndeDocument(filterQuery, select);
  }

  async updateUser(id: string, updateQuery: UpdateQuery<User>): Promise<User> {
    return this.userRepository.updateDocument({ _id: id }, updateQuery);
  }

  async deleteUser(id: string): Promise<User> {
    return this.userRepository.deleteDocument({ _id: id });
  }

}
