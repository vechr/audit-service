import { AuditAction, Audit, Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class ListAuditResponse implements Audit {
  id: string;

  auditable: string;

  auditableId: string;

  previous: Prisma.JsonValue;

  incoming: Prisma.JsonValue;

  action: AuditAction;

  username: string;

  userId: string;

  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
