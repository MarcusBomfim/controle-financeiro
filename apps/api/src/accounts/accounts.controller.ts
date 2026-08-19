import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createAccountSchema, updateAccountSchema } from './accounts.schemas';
import type {
  CreateAccountInput,
  UpdateAccountInput,
} from './accounts.schemas';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(SessionAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll(@CurrentUser() user: AuthUser) {
    return { accounts: await this.accountsService.findAll(user.id) };
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createAccountSchema))
    input: CreateAccountInput,
  ) {
    return this.accountsService.create(user.id, input);
  }

  @Patch(':accountId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('accountId') accountId: string,
    @Body(new ZodValidationPipe(updateAccountSchema))
    input: UpdateAccountInput,
  ) {
    return this.accountsService.update(user.id, accountId, input);
  }
}
