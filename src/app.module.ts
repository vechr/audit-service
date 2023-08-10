import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { OpenTelemetryModule } from 'nestjs-otel';
import { TerminusModule } from '@nestjs/terminus';
import AuthModule from './core/auth.module';
import AuditModule from './modules/audits/audit.module';
import { PrismaModule } from './prisma/prisma.module';
import { logger } from './shared/utils/log.util';
import { InstrumentMiddleware } from './shared/middlewares/instrument.middleware';
import HealthModule from './modules/health/health.module';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});

const PinoLoggerModule = LoggerModule.forRoot({
  pinoHttp: {
    customLogLevel: function (_, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'error';
      } else if (res.statusCode >= 500 || err) {
        return 'fatal';
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'warn';
      } else if (res.statusCode >= 200 && res.statusCode < 300) {
        return 'info';
      }
      return 'debug';
    },
    logger,
  },
});

@Module({
  imports: [
    OpenTelemetryModuleConfig,
    PinoLoggerModule,

    PrismaModule,
    AuthModule,
    AuditModule,
    TerminusModule,
    HealthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(InstrumentMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
