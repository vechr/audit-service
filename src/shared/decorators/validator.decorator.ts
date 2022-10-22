import { UsePipes } from '@nestjs/common';
import ValidationPipe from '../pipes/validation.pipe';

interface ClassConstructor {
  new (...args: any[]): any;
}

export default function Validator(dto: ClassConstructor) {
  return UsePipes(new ValidationPipe(dto));
}
