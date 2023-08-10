import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import PrismaService from '@/prisma/prisma.service';

@Controller('health')
export default class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Version(VERSION_NEUTRAL)
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('prisma-database', this.prisma),
    ]);
  }
}
