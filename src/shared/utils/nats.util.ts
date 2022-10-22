import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export const requestReply = async <R>(
  client: ClientProxy,
  topic: string,
  payload: any,
): Promise<R> => {
  const result = await firstValueFrom(client.send(topic, payload));

  return result as R;
};

export const publish = async <R>(
  client: ClientProxy,
  topic: string,
  payload: any,
): Promise<R> => {
  const result = await firstValueFrom(client.emit(topic, payload));

  return result as R;
};
