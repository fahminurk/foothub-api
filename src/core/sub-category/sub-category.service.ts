import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubcategoryDto } from './subcategory.dto';

@Injectable()
export class SubCategoryService {
  constructor(private readonly db: PrismaService) {}

  async getAllSubcategories() {
    return await this.db.subcategory.findMany({
      include: { shoe: true, category: true },
    });
  }

  async getSubcategoryById(id: number) {
    return await this.db.subcategory.findUnique({ where: { id } });
  }

  async getSubcategoryByCategory(id: string) {
    return await this.db.subcategory.findMany({
      where: { categoryId: Number(id) },
    });
  }

  async createSubategory(data: CreateSubcategoryDto) {
    const existing = await this.db.subcategory.findFirst({
      where: {
        categoryId: Number(data.categoryId),
        name: { equals: data.name, mode: 'insensitive' },
      },
    });

    if (existing) throw new BadRequestException('Subcategory already exists');

    return await this.db.subcategory.create({
      data: {
        name: data.name,
        categoryId: Number(data.categoryId),
      },
    });
  }

  async updateSubategory(id: number, data: CreateSubcategoryDto) {
    return await this.db.subcategory.update({
      where: { id },
      data: {
        name: data.name,
        categoryId: Number(data.categoryId),
      },
    });
  }

  async deleteSubategory(id: number) {
    return await this.db.subcategory.delete({ where: { id } });
  }
}
