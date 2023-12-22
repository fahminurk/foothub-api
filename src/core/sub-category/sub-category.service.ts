import { Injectable } from '@nestjs/common';
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

  async createSubategory(data: CreateSubcategoryDto) {
    return await this.db.subcategory.create({ data });
  }

  async deleteSubategory(id: number) {
    return await this.db.subcategory.delete({ where: { id } });
  }
}
