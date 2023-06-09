import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import appConstant from '@constants/app.constant';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: appConstant.JWT_SECRET,
      signOptions: { expiresIn: appConstant.JWT_EXPIRES_IN },
    }),
    ClientsModule.register([
      {
        name: appConstant.NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [appConstant.NATS_URL],
          maxReconnectAttempts: 10,
          tls: {
            caFile: appConstant.NATS_CA,
            keyFile: appConstant.NATS_KEY,
            certFile: appConstant.NATS_CERT,
          },
        },
      },
    ]),
  ],
  providers: [AuthStrategy],
})
export default class AuthModule {}
