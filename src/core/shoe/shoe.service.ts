import { Injectable } from '@nestjs/common';
import { Shoe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShoeDto } from './shoe.dto';

@Injectable()
export class ShoeService {
  constructor(private readonly db: PrismaService) {}

  async getAllProduct(query: {
    brand?: string;
    category?: string;
    subcategory?: string;
  }): Promise<Shoe[]> {
    const whereClause: { OR?: any[] } = {};

    if (query.brand) {
      whereClause.OR = [{ brand: { name: { contains: query.brand } } }];
    }

    if (query.category && query.subcategory) {
      whereClause.OR = [
        ...(whereClause.OR || []),
        {
          AND: [
            { category: { name: { startsWith: query.category } } },
            { subCategory: { name: { contains: query.subcategory } } },
          ],
        },
      ];
    } else if (query.category) {
      whereClause.OR = [
        ...(whereClause.OR || []),
        { category: { name: { startsWith: query.category } } },
      ];
    }

    return await this.db.shoe.findMany({
      where: whereClause,
      include: {
        brand: true,
        category: true,
        shoeImage: true,
        subCategory: true,
        stock: true,
      },
    });
  }

  async getProductById(id: number): Promise<Shoe> {
    return await this.db.shoe.findUnique({ where: { id } });
  }

  async createProduct(
    data: CreateShoeDto,
    files: Express.Multer.File[],
  ): Promise<Shoe> {
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
      data: files.map((file) => {
        return {
          imgUrl: `static/shoe/${file.filename}`,
          shoeId: Number(shoe.id),
        };
      }),
    });

    return shoe;
  }
}
