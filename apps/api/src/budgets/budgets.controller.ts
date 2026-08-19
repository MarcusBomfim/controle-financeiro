import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { MonthQuery } from '../common/schemas/month.schema';
import { monthQuerySchema } from '../common/schemas/month.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { upsertBudgetSchema } from './budgets.schemas';
import type { UpsertBudgetInput } from './budgets.schemas';
import { BudgetsService } from './budgets.service';

@Controller('budgets')
@UseGuards(SessionAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(monthQuerySchema)) query: MonthQuery,
  ) {
    return {
      budgets: await this.budgetsService.findAll(user.id, query),
    };
  }

  @Put()
  upsert(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(upsertBudgetSchema))
    input: UpsertBudgetInput,
  ) {
    return this.budgetsService.upsert(user.id, input);
  }

  @Delete(':budgetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: AuthUser,
    @Param('budgetId') budgetId: string,
  ) {
    await this.budgetsService.remove(user.id, budgetId);
  }
}
