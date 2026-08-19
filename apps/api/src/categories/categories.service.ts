import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '../generated/prisma/client';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './categories.schemas';
import { defaultCategories } from './default-categories';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string) {
    await this.ensureDefaults(ownerId);

    return this.prisma.category.findMany({
      where: { ownerId },
      orderBy: [{ active: 'desc' }, { type: 'asc' }, { name: 'asc' }],
    });
  }

  async create(ownerId: string, input: CreateCategoryInput) {
    try {
      return await this.prisma.category.create({
        data: { ...input, ownerId },
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  async update(
    ownerId: string,
    categoryId: string,
    input: UpdateCategoryInput,
  ) {
    await this.ensureOwnership(ownerId, categoryId);

    try {
      return await this.prisma.category.update({
        where: { id: categoryId },
        data: input,
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  async ensureDefaults(ownerId: string) {
    await this.prisma.category.createMany({
      data: defaultCategories.map((category) => ({ ...category, ownerId })),
      skipDuplicates: true,
    });
  }

  private async ensureOwnership(ownerId: string, categoryId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, ownerId },
      select: { id: true },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }
  }

  private handleUniqueConstraint(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Já existe uma categoria com este nome e tipo.',
      );
    }
  }
}
