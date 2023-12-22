import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly db: PrismaService) {}

  async getAllCategories() {
    return await this.db.category.findMany({
      include: { shoe: true, subcategory: true },
    });
  }

  async getCategoryById(id: number) {
    return await this.db.category.findUnique({ where: { id } });
  }

  async createCategory(data: CreateCategoryDto, file: Express.Multer.File) {
    return await this.db.category.create({
      data: {
        ...data,
        imgUrl: file?.filename ? 'static/category/' + file?.filename : null,
      },
    });
  }

  async deleteCategory(id: number) {
    return await this.db.category.delete({ where: { id } });
  }
}
