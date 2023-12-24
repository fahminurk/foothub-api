import { Body, Controller, Get, Post } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  getAllStock() {
    return this.stockService.getAllStock();
  }

  @Post()
  createStock(@Body() data: { shoeId: number; sizeId: number; stock: number }) {
    return this.stockService.createStock(data);
  }
}
