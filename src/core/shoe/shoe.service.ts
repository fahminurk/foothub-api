import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Shoe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShoeDto } from './shoe.dto';
import {
  CloudinaryResponse,
  CloudinaryService,
} from '../cloudinary/cloudinary.service';
import { QueryProduct } from './types';

@Injectable()
export class ShoeService {
  constructor(
    private readonly db: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAllProduct(query: QueryProduct): Promise<Shoe[]> {
    const whereClause: { OR?: any[] } = {};
    const { brand, category, orderBy, search, sortBy, subcategory } = query;
    const asd = search?.replace(/ /g, ' & ');

    if (brand) {
      whereClause.OR = [{ brand: { name: { contains: brand } } }];
    } else if (search) {
      whereClause.OR = [
        { name: { contains: asd, mode: 'insensitive' } },
        { brand: { name: { contains: asd, mode: 'insensitive' } } },
        { subCategory: { name: { contains: asd, mode: 'insensitive' } } },
        { category: { name: { contains: asd, mode: 'insensitive' } } },
      ];
    }

    if (category && subcategory) {
      whereClause.OR = [
        ...(whereClause.OR || []),
        {
          AND: [
            {
              category: {
                name: { startsWith: category, mode: 'insensitive' },
              },
            },
            {
              subCategory: {
                name: { contains: subcategory, mode: 'insensitive' },
              },
            },
          ],
        },
      ];
    } else if (category) {
      whereClause.OR = [
        ...(whereClause.OR || []),
        {
          category: {
            name: { startsWith: category, mode: 'insensitive' },
          },
        },
      ];
    }

    return await this.db.shoe.findMany({
      where: whereClause,
      orderBy: { [sortBy || 'name']: orderBy || 'asc' },

      include: {
        brand: true,
        category: true,
        shoeImage: true,
        subCategory: true,
        stock: true,
      },
    });
  }

  async getProductById(
    id: number,
  ): Promise<{ shoe: Shoe; sizeAndStock: { size: string; stock: unknown }[] }> {
    const shoe = await this.db.shoe.findUnique({
      include: {
        brand: true,
        category: true,
        shoeImage: true,
        subCategory: true,
        stock: {
          include: { size: true },
        },
      },
      where: { id },
    });

    const sizeAndStockReduce = shoe.stock.reduce((acc, cur) => {
      if (acc[cur.size.size]) {
        acc[cur.size.size] += cur.stock;
      } else {
        acc[cur.size.size] = cur.stock;
      }
      return acc;
    }, {});

    const sizeAndStock = Object.entries(sizeAndStockReduce).map(
      ([size, stock]) => ({ size, stock }),
    );

    return { shoe, sizeAndStock };
  }

  async createProduct(
    data: CreateShoeDto,
    files: Express.Multer.File[],
  ): Promise<Shoe> {
    const filesImg: CloudinaryResponse[] = [];
    for (const file of files) {
      const res = await this.cloudinaryService.uploadFile(file);
      filesImg.push(res);
    }

    const shoe = await this.db.shoe.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        weight: Number(data.weight),
        status: data.status,
        brandId: Number(data.brandId),
        subcategoryId: Number(data.subcategoryId),
        categoryId: Number(data.categoryId),
      },
    });

    await this.db.shoeImage.createMany({
      data: filesImg.map((file) => {
        return {
          imgUrl: file.secure_url,
          public_id: file.public_id,
          shoeId: Number(shoe.id),
        };
      }),
    });

    return shoe;
  }

  async deleteProduct(id: number) {
    const shoe = await this.db.shoe.findUnique({ where: { id } });

    if (!shoe) throw new NotFoundException('Shoe not found');

    const shoeImages = await this.db.shoeImage.findMany({
      where: {
        shoeId: Number(shoe.id),
      },
    });

    for (const image of shoeImages) {
      await this.cloudinaryService.destroyFile(image.public_id);
    }

    return await this.db.shoe.delete({ where: { id } });
  }

  async deleteAllProduct() {
    return await this.db.shoe.deleteMany();
  }

  async createShoeSize(data: { size: string }) {
    const existingSize = await this.db.shoeSize.findFirst({
      where: { size: { equals: data.size, mode: 'insensitive' } },
    });

    if (existingSize) throw new BadRequestException('Size already exists');

    return await this.db.shoeSize.create({ data });
  }

  async getAllSize() {
    return await this.db.shoeSize.findMany();
  }
}
