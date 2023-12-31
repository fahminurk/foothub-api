import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async getCategoryByName(name: string) {
    return await this.db.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  async createCategory(data: CreateCategoryDto, file: Express.Multer.File) {
    const existingCategory = await this.getCategoryByName(data.name);

    if (existingCategory)
      throw new BadRequestException('Category already exists');

    const fileImg = await this.cloudinaryService.uploadFile(file);

    return await this.db.category.create({
      data: {
        ...data,
        public_id: fileImg ? fileImg.public_id : null,
        imgUrl: fileImg ? fileImg.secure_url : null,
      },
    });
  }

  async deleteCategory(id: number) {
    const category = await this.getCategoryById(id);

    if (!category) throw new NotFoundException('Category not found');

    if (category.public_id) {
      await this.cloudinaryService.destroyFile(category.public_id);
    }

    return await this.db.category.delete({ where: { id } });
  }
}
