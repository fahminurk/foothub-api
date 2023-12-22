import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBrandDto } from './brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly db: PrismaService) {}

  async getAllBrands() {
    return await this.db.brand.findMany({ include: { shoe: true } });
  }

  async getBrandById(id: number) {
    return await this.db.brand.findUnique({ where: { id } });
  }

  async createBrand(data: CreateBrandDto, file: Express.Multer.File) {
    return await this.db.brand.create({
      data: {
        ...data,
        imgUrl: file?.filename ? 'static/brand/' + file?.filename : null,
      },
    });
  }

  async deleteShoe(id: number) {
    return await this.db.brand.delete({ where: { id } });
  }
}
