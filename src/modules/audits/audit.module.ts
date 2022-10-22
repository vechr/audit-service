import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import AuditNatsController from './audit.nats';
import AuditService from './audit.service';
import AuditController from './audit.controller';
import appConstant from '@/constants/app.constant';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: appConstant.NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [appConstant.NATS_URL],
        },
      },
    ]),
  ],
  controllers: [AuditNatsController, AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export default class AuditModule {}
