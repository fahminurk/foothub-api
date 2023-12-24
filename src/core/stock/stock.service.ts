import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly db: PrismaService) {}

  async getAllStock() {
    return await this.db.stock.findMany({
      include: { shoe: true, size: true },
    });
  }

  async createStock(data: { shoeId: number; sizeId: number; stock: number }) {
    return await this.db.stock.create({
      data: {
        stock: Number(data.stock),
        shoeId: Number(data.shoeId),
        sizeId: Number(data.sizeId),
      },
    });
  }
}
