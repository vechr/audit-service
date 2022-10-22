import { Prisma, Audit } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type TListAuditRequestQuery = IListRequestQuery<
  Audit,
  Prisma.AuditWhereInput
>;
