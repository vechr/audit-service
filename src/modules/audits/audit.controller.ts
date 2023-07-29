import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import AuditService from './audit.service';
import ListAuditResponse from './serializers/list-audit.response';
import ListAuditValidator, {
  ListAuditQueryValidator,
} from './validators/list-audit.validator';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';
import Authentication from '@/shared/decorators/authentication.decorator';
import Authorization from '@/shared/decorators/authorization.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import UseList from '@/shared/decorators/uselist.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import SuccessResponse from '@/shared/responses/success.response';
import Context from '@/shared/decorators/context.decorator';

@ApiTags('AuditAuth')
@ApiBearerAuth('access-token')
@Controller('audit/auditable')
@OtelInstanceCounter()
export default class AuditController {
  constructor(private readonly auditAuthService: AuditService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('audit:read@auth')
  @UseList()
  @Validator(ListAuditValidator)
  @Serializer(ListAuditResponse)
  @ApiFilterQuery('filters', ListAuditQueryValidator)
  @OtelMethodCounter()
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.auditAuthService.list(ctx);

    return new SuccessResponse('audit listed successfully', result, meta);
  }
}
