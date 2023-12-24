import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './category.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly db: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAllCategories() {
    return await this.db.category.findMany({
      include: { shoe: true, subcategory: true },
    });
  }

  async getCategoryById(id: number) {
    return await this.db.category.findUnique({ where: { id } });
  }

  async createCategory(data: CreateCategoryDto, file: Express.Multer.File) {
    const fileImg = await this.cloudinaryService.uploadFile(file);
    return await this.db.category.create({
      data: {
        ...data,
        imgUrl: fileImg ? fileImg.secure_url : null,
      },
    });
  }

  async deleteCategory(id: number) {
    return await this.db.category.delete({ where: { id } });
  }
}
