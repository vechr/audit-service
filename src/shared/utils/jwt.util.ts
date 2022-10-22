import appConstant from '@constants/app.constant';
import CryptoJS from 'crypto-js';
import { ExtractJwt } from 'passport-jwt';
import { TUserCustomInformation } from '../types/user.type';

const { fromExtractors, fromAuthHeaderAsBearerToken } = ExtractJwt;

export interface IGeneratedJwt {
  refresh: string;
  token: string;
  expired: Date;
}

export interface IDecryptedJwt {
  payload: string;
  aud: string;
  iss: string;
  sub: string;
  exp: number;
  iat: number;
}

export const jwtOptions = {
  jwtFromRequest: fromExtractors([
    cookieExtractor,
    fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: appConstant.JWT_SECRET,
  jwtCookieName: 'access-token',
};

export function cookieExtractor(req: any) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[jwtOptions.jwtCookieName];
  }
  console.log(req.cookies);
  return token;
}

export const decryptedDataUser = (secureData: string) => {
  const deData = CryptoJS.AES.decrypt(
    decodeURIComponent(secureData),
    appConstant.ECRYPTED_SECRET,
  );

  if (!isJsonString(deData.toString(CryptoJS.enc.Utf8))) {
    return null;
  }

  return JSON.parse(
    deData.toString(CryptoJS.enc.Utf8),
  ) as TUserCustomInformation;
};

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
