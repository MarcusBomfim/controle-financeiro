import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { MonthQuery } from '../common/schemas/month.schema';
import { monthQuerySchema } from '../common/schemas/month.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(SessionAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  overview(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(monthQuerySchema)) query: MonthQuery,
  ) {
    return this.dashboardService.getMonthlyOverview(user.id, query);
  }
}
