import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getBrandByName(name: string) {
    return await this.db.brand.findFirst({
      where: { name: { equals: name } },
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
    const existingBrand = await this.getBrandByName(brand.name);

    if (!brand) throw new NotFoundException('Brand not found');
    if (existingBrand) throw new BadRequestException('Brand already exists');

    if (brand.public_id) {
      await this.cloudinaryService.destroyFile(brand.public_id);
    }
    return await this.db.brand.delete({ where: { id } });
  }
}
