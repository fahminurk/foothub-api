import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStockDto } from './stock.dto';

@Injectable()
export class StockService {
  constructor(private readonly db: PrismaService) {}

  async getAllStock() {
    return await this.db.stock.findMany({
      include: { shoe: true, size: true },
    });
  }

  async createStock(data: CreateStockDto) {
    const existingStock = await this.db.stock.findFirst({
      where: {
        shoeId: Number(data.shoeId),
        sizeId: Number(data.sizeId),
      },
    });

    if (existingStock) throw new BadRequestException('Stock already exists');

    return await this.db.stock.create({
      data: {
        stock: Number(data.stock),
        shoeId: Number(data.shoeId),
        sizeId: Number(data.sizeId),
      },
    });
  }
}
