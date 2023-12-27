import { Module } from '@nestjs/common';
import { CityProvinceService } from './city-province.service';
import { CityProvinceController } from './city-province.controller';

@Module({
  controllers: [CityProvinceController],
  providers: [CityProvinceService],
  exports: [CityProvinceService],
})
export class CityProvinceModule {}
