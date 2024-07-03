import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginInput } from './input/login.input';
import { CreateUserInput } from 'src/user/input/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  generateToken(paylod: object, secret?: string, expiresin?: string): string {
    const token = this.jwtService.sign(
      { ...paylod },
      {
        secret: secret,
        expiresIn: expiresin || '1h',
      },
    );
    return token;
  }

  validateToken(
    token: string,
    secret?: string,
  ): boolean | UnauthorizedException | UnprocessableEntityException {
    try {
      const isValidToken = this.jwtService.verify(token, {
        secret,
        ignoreExpiration: false,
      });
      if (!isValidToken) {
        return false;
      }
      const { id } = isValidToken;
      return id;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'your token is not valid please login.',
        );
      }
      throw new UnprocessableEntityException(
        'error ocure when decoding please try again or login again.',
      );
    }
  }

  async loginUser(
    loginInput: LoginInput,
  ): Promise<{ token: string; user: User }> {
    const { identifire, password } = loginInput;
    try {
      const user = (await this.userService.findUser(
        {
          $or: [{ username: identifire }, { email: identifire }],
        },
        '+password',
      )) as User;
      // if password is not equall
      if (!(await compare(password, user.password))) {
        throw new UnauthorizedException('your username or password is wrong!.');
      }
      const token = this.generateToken({ id: user._id });
      return { token, user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('your username or password is wrong!.');
      }
      throw error;
    }
  }

  async singup(
    createUserInput: CreateUserInput,
  ): Promise<{ token: string; user: User }> {
    const user = await this.userService.createUser(createUserInput);
    const token = this.generateToken({ id: user._id });
    return { user, token };
  }
}
