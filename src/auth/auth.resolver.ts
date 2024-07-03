import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthType } from './type/auth.type';
import { LoginInput } from './input/login.input';
import { CreateUserInput } from 'src/user/input/create-user.input';
import { User } from 'src/user/entity/user.entity';

@Resolver((of) => AuthType)
export class AuthResolver {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Mutation((returns) => AuthType)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<{ token: String; user: User }> {
    return this.authService.loginUser(loginInput);
  }

  @Mutation((returns) => AuthType)
  async singup(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<{ token: String; user: User }> {
    return this.authService.singup(createUserInput);
  }
}
