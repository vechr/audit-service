import { HttpStatus } from '@nestjs/common';

import BaseException from './base.exception';

export enum EErrorCommonCode {
  BAD_REQUEST = '400',
  UNAUTHORIZED = '401',
  FORBIDDEN = '403',
  NOT_FOUND = '404',
  INTERNAL_SERVER_ERROR = '500',
}

export class BadRequestException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.BAD_REQUEST,
      payload?.code || EErrorCommonCode.BAD_REQUEST,
      payload?.message || 'bad request',
      payload?.params || {},
    );
  }
}

export class UnauthorizedException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.UNAUTHORIZED,
      payload?.code || EErrorCommonCode.UNAUTHORIZED,
      payload?.message || 'unauthorized',
      payload?.params || {},
    );
  }
}

export class ForbiddenException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.FORBIDDEN,
      payload?.code || EErrorCommonCode.FORBIDDEN,
      payload?.message || 'forbidden',
      payload?.params || {},
    );
  }
}

export class NotFoundException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.NOT_FOUND,
      payload?.code || EErrorCommonCode.NOT_FOUND,
      payload?.message || 'not found',
      payload?.params || {},
    );
  }
}

export class UnknownException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      payload?.code || EErrorCommonCode.INTERNAL_SERVER_ERROR,
      payload?.message || 'internal server error',
      payload?.params || {},
    );
  }
}
