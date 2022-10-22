import { ArgumentMetadata, Injectable } from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';

export type Enumerable<T> = T | Array<T>;

export type StringFilter = {
  equals?: string;
  in?: Enumerable<string>;
  notIn?: Enumerable<string>;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
};

@Injectable()
export default class ListQueryPipe {
  public async transform(value: any, metadata: ArgumentMetadata) {
    if (
      metadata.type !== 'custom' ||
      !this.needValidate(value, metadata.metatype) ||
      !Object.keys(value.params.query?.field || {}).length
    ) {
      return value;
    }

    try {
      const finalFieldQuery = instanceToInstance(value.params.query.field, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });

      value.params.query.field = finalFieldQuery;

      return value;
    } catch (error) {
      return value;
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
}
