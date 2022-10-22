import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

import SuccessResponse from '../responses/success.response';

interface ClassConstructor {
  new (...args: any[]): any;
}

export default class SerializerInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(ctx: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: SuccessResponse) => {
        const plainResult = data.getResult();

        if (Array.isArray(plainResult)) {
          const result: any[] = [];

          for (const item of plainResult) {
            result.push(plainToInstance(this.dto, item));
          }

          return { ...data, result };
        }

        const result = plainToInstance(this.dto, plainResult);

        return { ...data, result };
      }),
    );
  }
}
