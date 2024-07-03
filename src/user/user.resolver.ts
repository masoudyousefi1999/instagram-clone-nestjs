import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserType } from './type/user.type';
import { User } from './entity/user.entity';
import { LoginAuthGuard } from 'src/auth/guards/login.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UpdateUserInput } from './input/update-user.input';
import { NotEmptyUpdateQuery } from 'src/common/update-notEmpty.pipe';

@Resolver((of) => UserType)
export class UserResolver {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @UseGuards(LoginAuthGuard)
  @Query((returns) => [UserType], { name: 'users' })
  async findAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => UserType)
  async updateUser(
    @Args('updateUserInput', new NotEmptyUpdateQuery())
    updateUserInput: UpdateUserInput,
    @Context() context,
  ) : Promise<User> {
    const id = context.req.user._id;
    return this.userService.updateUser(id, updateUserInput);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => UserType)
  async deleteUser(@Context() context) : Promise<User> {
    const id = context.req.user._id;
    return this.userService.deleteUser(id);
  }
}
