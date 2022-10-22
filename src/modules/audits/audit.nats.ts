import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import AuditService from './audit.service';
import { TAuditUpdatedPayload } from './types/audit-updated.type';
import { TAuditCreatedPayload } from './types/audit-created.type';
import { TAuditDeletedPayload } from './types/audit-deleted.type';
import appConstant from '@/constants/app.constant';

@Controller()
export default class AuditNatsController {
  constructor(private readonly auditService: AuditService) {}

  @EventPattern(appConstant.AUDIT_EVENT.CREATED)
  public async created(
    @Payload() payload: TAuditCreatedPayload,
  ): Promise<void> {
    const result = await this.auditService.created(payload);
    return result;
  }

  @EventPattern(appConstant.AUDIT_EVENT.UPDATED)
  public async updated(
    @Payload() payload: TAuditUpdatedPayload,
  ): Promise<void> {
    const result = await this.auditService.updated(payload);
    return result;
  }

  @EventPattern(appConstant.AUDIT_EVENT.DELETED)
  public async deleted(
    @Payload() payload: TAuditDeletedPayload,
  ): Promise<void> {
    const result = await this.auditService.deleted(payload);
    return result;
  }
}
