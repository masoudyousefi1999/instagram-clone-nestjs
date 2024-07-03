import { CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { getToken } from '../decode.bearer.token';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';

export class LoginAuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    @Inject(AuthService) private readonly authService: AuthService, 
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const handler = gqlContext.getContext();
    const req: Request = handler.req;
    const token = getToken(req.headers?.authorization);
    const isValidToken = this.authService.validateToken(token);
    if (!isValidToken) {
      return false;
    }
    const user = await this.userService.findUser({ _id: isValidToken });
    if (!user) {
      return false;
    }
    (req as any).user = user;
    return true;
  }
}
