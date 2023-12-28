import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  getAllStock() {
    return this.stockService.getAllStock();
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  createStock(@Body() data: { shoeId: number; sizeId: number; stock: number }) {
    return this.stockService.createStock(data);
  }
}
