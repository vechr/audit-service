import { UsePipes } from '@nestjs/common';
import ListQueryPipe from '../pipes/list-query.pipe';

export default function UseList(): MethodDecorator & ClassDecorator {
  return UsePipes(ListQueryPipe);
}
