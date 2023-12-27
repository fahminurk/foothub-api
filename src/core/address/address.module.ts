import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { CityProvinceModule } from '../city-province/city-province.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [
    CityProvinceModule,
    HttpModule.register({
      headers: { key: process.env.OPENCAGE_API_KEY },
    }),
  ],
})
export class AddressModule {}
