import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createTransactionSchema,
  transactionQuerySchema,
} from './transactions.schemas';
import type {
  CreateTransactionInput,
  TransactionQuery,
} from './transactions.schemas';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(SessionAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(transactionQuerySchema))
    query: TransactionQuery,
  ) {
    return {
      transactions: await this.transactionsService.findAll(user.id, query),
    };
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createTransactionSchema))
    input: CreateTransactionInput,
  ) {
    return this.transactionsService.create(user.id, input);
  }

  @Patch(':transactionId/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(
    @CurrentUser() user: AuthUser,
    @Param('transactionId') transactionId: string,
  ) {
    return this.transactionsService.cancel(user.id, transactionId);
  }
}
