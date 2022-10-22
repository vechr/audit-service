import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import {
  ForbiddenException,
  UnauthorizedException,
} from '../exceptions/common.exception';
import { TUserCustomInformation } from '../types/user.type';
import { log } from '../utils/log.util';

enum EErrorJwtCode {
  TOKEN_EXPIRED = '401',
  TOKEN_INVALID = '401',
}

export class AuthenticationGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest<TUser = TUserCustomInformation>(
    err: any,
    user: any,
    info: any,
    context: any,
  ): TUser {
    if (info) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          message: 'token expired',
          code: EErrorJwtCode.TOKEN_EXPIRED,
          params: { message: info.message },
        });
      }
      if (info.message === 'No auth token') {
        throw new UnauthorizedException({
          message: 'token required',
          params: { message: info.message },
        });
      }
    }

    if (err || info || !user) {
      if (
        err instanceof JsonWebTokenError ||
        info instanceof JsonWebTokenError ||
        !user
      ) {
        throw new UnauthorizedException({
          message: 'invalid token',
          code: EErrorJwtCode.TOKEN_INVALID,
          params: {
            message: err?.message || info?.message || 'user not found',
          },
        });
      }
    }

    const customUser = user as TUserCustomInformation;

    let isAuthorized = true;
    try {
      const requiredRoles = [
        'root',
        ...this.reflector.getAllAndOverride<string[]>('authorization', [
          context.getHandler(),
          context.getClass(),
        ]),
      ];

      const intersectedPermission = requiredRoles.filter((value) =>
        customUser.permissions.includes(value),
      );

      isAuthorized = !!intersectedPermission.length;
    } catch (error) {
      const req = context.getRequest();
      log.warn(`skip authorization for ${req.route?.path || req.url}`);
    }

    if (!isAuthorized) {
      throw new ForbiddenException();
    }

    return customUser as any;
  }
}
