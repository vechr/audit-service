import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  ValidationPipe as OriginalValidationPipe,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { BadRequestException } from '../exceptions/common.exception';

interface ClassConstructor {
  new (...args: any[]): any;
}

@Injectable()
export default class ValidationPipe extends OriginalValidationPipe {
  constructor(private dto: ClassConstructor) {
    super();
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (
        metadata.type !== 'custom' ||
        !this.needValidate(value, metadata.metatype)
      ) {
        return value;
      }

      const input = plainToClass(
        this.dto,
        Object.keys(value.params).length ? value.params : value,
      );
      await validateOrReject(input).catch((errors) => {
        throw this.exceptionFactory(errors);
      });

      return { ...value, params: input };
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.BAD_REQUEST) {
          const response = err.getResponse() as {
            message: string[] | string;
          };

          const messages = this.parseMessages(response.message);

          throw new BadRequestException({
            message: 'invalid payload',
            params: {
              details: messages,
            },
          });
        }

        throw err;
      }
    }
  }

  private needValidate(value: any, metatype: any): boolean {
    const types = [Object];
    const ctxParamsProps = ['params', 'body', 'query'];

    const isCtx =
      value.params &&
      Object.keys(value.params).length === 3 &&
      Object.keys(value.params).every((prop) => ctxParamsProps.includes(prop));

    const isCtxParams =
      value &&
      Object.keys(value).length === 3 &&
      Object.keys(value).every((prop) => ctxParamsProps.includes(prop));

    return types.includes(metatype) && value && (isCtx || isCtxParams);
  }

  private parseMessages(message: string[] | string): string[] {
    if (typeof message === 'string') {
      return [message];
    }

    return message;
  }
}
