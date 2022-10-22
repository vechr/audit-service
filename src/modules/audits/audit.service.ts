import { AuditAction, Audit } from '@prisma/client';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TAuditUpdatedPayload } from './types/audit-updated.type';
import { TAuditCreatedPayload } from './types/audit-created.type';
import { TAuditDeletedPayload } from './types/audit-deleted.type';
import { TListAuditRequestQuery } from './requests/list-audit.request';
import log from '@/shared/utils/log.util';
import PrismaService from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { publish } from '@/shared/utils/nats.util';
import { TUserCustomInformation } from '@/shared/types/user.type';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';
import appConstant from '@/constants/app.constant';

export default class AuditAuthService {
  constructor(
    private readonly db: PrismaService,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) {}

  public async list(ctx: IContext): Promise<{
    result: Audit[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListAuditRequestQuery;

    const { limit, offset, order, page } =
      parseQuery<TListAuditRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, audits] = await this.db.$transaction([
      this.db.audit.count(selectOptions),
      this.db.audit.findMany({ ...pageOptions, ...selectOptions }),
    ]);

    const meta = parseMeta<Audit>({
      result: audits,
      total,
      page,
      limit,
    });

    return {
      result: audits,
      meta,
    };
  }

  public async created(payload: TAuditCreatedPayload): Promise<void> {
    const identifier = `${payload.auditable}:${payload.auditableId}@${AuditAction.CREATED}`;

    log.info(`attempt to audit for ${identifier}`);

    try {
      await this.store(AuditAction.CREATED, payload);

      log.info(`successfully audited for ${identifier}`);
    } catch (error) {
      log.error(`error while auditing for ${identifier}`, error);
    }
  }

  public async updated(payload: TAuditUpdatedPayload): Promise<void> {
    const identifier = `${payload.auditable}:${payload.auditableId}@${AuditAction.UPDATED}`;

    log.info(`attempt to audit for ${identifier}`);

    try {
      await this.store(AuditAction.UPDATED, payload);

      log.info(`successfully audited for ${identifier}`);
    } catch (error) {
      log.error(`error while auditing for ${identifier}`, error);
    }
  }

  public async deleted(payload: TAuditDeletedPayload): Promise<void> {
    const identifier = `${payload.auditable}:${payload.auditableId}@${AuditAction.DELETED}`;

    log.info(`attempt to audit for ${identifier}`);

    try {
      await this.store(AuditAction.DELETED, payload);

      log.info(`successfully audited for ${identifier}`);
    } catch (error) {
      log.error(`error while auditing for ${identifier}`, error);
    }
  }

  private async store(
    action: AuditAction,
    payload: TAuditCreatedPayload | TAuditUpdatedPayload | TAuditDeletedPayload,
  ): Promise<void> {
    await this.db.audit.create({
      data: {
        auditable: payload.auditable,
        auditableId: payload.auditableId,
        previous: payload.previous || {},
        incoming: payload.incoming || {},
        action,
        username: payload.username,
        userId: payload.userId,
      },
    });
  }

  public async sendAudit(
    ctx: IContext,
    action: AuditAction,
    {
      id,
      prev,
      incoming,
      auditable,
    }: {
      id: string;
      prev?: Record<string, any>;
      incoming?: Record<string, any>;
      auditable?: string;
    },
  ) {
    let topic = '';

    switch (action) {
      case AuditAction.CREATED:
        topic = appConstant.AUDIT_EVENT.CREATED;
        break;
      case AuditAction.UPDATED:
        topic = appConstant.AUDIT_EVENT.UPDATED;
        break;
      case AuditAction.DELETED:
        topic = appConstant.AUDIT_EVENT.DELETED;
        break;
      default:
        break;
    }

    if (topic) {
      await publish(this.client, topic, {
        auditable,
        auditableId: id,
        previous: prev || {},
        incoming: incoming || {},
        username: (ctx.user as TUserCustomInformation).username,
        userId: (ctx.user as TUserCustomInformation).id,
      } as TAuditCreatedPayload);
    }
  }
}
