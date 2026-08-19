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
import {
  createCategorySchema,
  updateCategorySchema,
} from './categories.schemas';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './categories.schemas';
import { CategoriesService } from './categories.service';

@Controller('categories')
@UseGuards(SessionAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(@CurrentUser() user: AuthUser) {
    return { categories: await this.categoriesService.findAll(user.id) };
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createCategorySchema))
    input: CreateCategoryInput,
  ) {
    return this.categoriesService.create(user.id, input);
  }

  @Patch(':categoryId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('categoryId') categoryId: string,
    @Body(new ZodValidationPipe(updateCategorySchema))
    input: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(user.id, categoryId, input);
  }
}
