import { ApiPropertyOptional } from '@nestjs/swagger';
import { Audit, Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { TListAuditRequestQuery } from '../requests/list-audit.request';
import { BaseQueryValidator, OperatorQuery } from '@/shared/types/query.type';

export class ListAuditQueryField implements Prisma.AuditWhereInput {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  id?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  @ApiPropertyOptional({ type: OperatorQuery })
  auditable?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  auditableId?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  previous?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  incoming?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  action?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  username?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  userId?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  createdAt?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  updatedAt?: OperatorQuery;
}

export class ListAuditQueryValidator extends BaseQueryValidator<Audit> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListAuditQueryField)
  @ApiPropertyOptional({ type: ListAuditQueryField })
  field?: ListAuditQueryField;
}

class FilterAuditQueryValidator implements TListAuditRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListAuditQueryValidator)
  filters: ListAuditQueryValidator;
}

export default class ListAuditValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterAuditQueryValidator)
  query: FilterAuditQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
