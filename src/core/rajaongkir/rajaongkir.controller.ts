import { Controller, Get } from '@nestjs/common';
import { RajaongkirService } from './rajaongkir.service';

@Controller('rajaongkir')
export class RajaongkirController {
  constructor(private readonly rajaongkirService: RajaongkirService) {}

  @Get('provinces')
  getProvinces() {
    return this.rajaongkirService.getProvinces();
  }

  @Get('cities')
  getCities() {
    return this.rajaongkirService.getCities();
  }
}
