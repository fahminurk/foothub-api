import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBrandDto } from './brand.dto';
import {
  CloudinaryResponse,
  CloudinaryService,
} from '../cloudinary/cloudinary.service';
import { Brand } from '@prisma/client';

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

  async getBrandByName(name: string) {
    return await this.db.brand.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  async createBrand(data: CreateBrandDto, file: Express.Multer.File) {
    const existingBrand = await this.getBrandByName(data.name);

    if (existingBrand) throw new BadRequestException('Brand already exists');

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
    const brand = await this.getBrandById(id);

    if (!brand) throw new NotFoundException('Brand not found');

    if (brand.public_id) {
      await this.cloudinaryService.destroyFile(brand.public_id);
    }
    return await this.db.brand.delete({ where: { id } });
  }

  async updateBrand(
    id: number,
    data: Partial<Brand>,
    file: Express.Multer.File,
  ): Promise<Brand> {
    let fileImg: CloudinaryResponse;
    const brand = await this.getBrandById(id);

    if (!brand) throw new NotFoundException('brand not found');

    if (file) {
      fileImg = await this.cloudinaryService.uploadFile(file);
      if (brand.public_id) {
        await this.cloudinaryService.destroyFile(brand.public_id);
      }
    }

    return this.db.brand.update({
      where: { id },
      data: {
        name: data.name,
        imgUrl: file && fileImg.secure_url,
        public_id: file && fileImg.public_id,
      },
    });
  }
}
