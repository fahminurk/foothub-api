import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBrandDto } from './brand.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BrandService {
  constructor(
    private readonly db: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAllBrands() {
    return await this.db.brand.findMany({ include: { shoe: true } });
  }

  async getBrandById(id: number) {
    return await this.db.brand.findUnique({ where: { id } });
  }

  async createBrand(data: CreateBrandDto, file: Express.Multer.File) {
    const fileImg = await this.cloudinaryService.uploadFile(file);
    return await this.db.brand.create({
      data: {
        ...data,
        public_id: fileImg ? fileImg.public_id : null,
        imgUrl: fileImg ? fileImg.secure_url : null,
      },
    });
  }

  async deleteShoe(id: number) {
    return await this.db.brand.delete({ where: { id } });
  }
}
