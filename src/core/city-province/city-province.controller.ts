import { Controller, Get, Param } from '@nestjs/common';
import { CityProvinceService } from './city-province.service';

@Controller('')
export class CityProvinceController {
  constructor(private readonly cityProvinceService: CityProvinceService) {}

  @Get('provinces')
  findAllProvince() {
    return this.cityProvinceService.getAllProvinces();
  }

  @Get('cities')
  findAllCity() {
    return this.cityProvinceService.getAllCities();
  }

  @Get('cities/:province_id')
  findCityByProv(@Param('province_id') province_id: string) {
    return this.cityProvinceService.getCityByProv(province_id);
  }
}
