import { SetMetadata } from '@nestjs/common';

const Authorization = (...permissions: string[]) => {
  return SetMetadata('authorization', permissions);
};

export default Authorization;
