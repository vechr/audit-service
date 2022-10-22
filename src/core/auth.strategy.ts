import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';

import {
  cookieExtractor,
  decryptedDataUser,
  IDecryptedJwt,
} from '@shared/utils/jwt.util';
import appConstant from '@constants/app.constant';

import { TUserCustomInformation } from '@/shared/types/user.type';

const { fromExtractors, fromAuthHeaderAsBearerToken } = ExtractJwt;

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest:
        fromExtractors([cookieExtractor, fromAuthHeaderAsBearerToken()]) ??
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConstant.JWT_SECRET,
    });
  }

  async validate(jwt: IDecryptedJwt) {
    const customUser = await this.getCustomUser(jwt);

    return customUser;
  }

  private async getCustomUser(
    jwt: IDecryptedJwt,
  ): Promise<TUserCustomInformation> {
    const user = decryptedDataUser(jwt.payload);

    if (!user) {
      throw new JsonWebTokenError('sub not valid');
    }

    return user;
  }
}
