import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from 'src/user/role.enum';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    if (req.user) {
      if (req.user.role === Role.ADMIN) {
        return true;
      }
      throw new UnauthorizedException('only admin access this route.');
    }
    return false;
  }
}
