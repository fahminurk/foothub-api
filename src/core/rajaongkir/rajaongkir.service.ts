import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CityResponse, ProvinceResponse } from './types';

@Injectable()
export class RajaongkirService {
  constructor(
    private readonly httpService: HttpService,
    private readonly db: PrismaService,
  ) {}

  async getProvinces() {
    const res = await this.httpService.axiosRef.get<ProvinceResponse>(
      'https://api.rajaongkir.com/starter/province',
    );

    const provinces = await this.db.province.createMany({
      data: res.data.rajaongkir.results.map((val) => {
        return {
          province_id: val.province_id,
          province: val.province,
        };
      }),
    });

    return provinces;
  }

  async getCities() {
    const res = await this.httpService.axiosRef.get<CityResponse>(
      'https://api.rajaongkir.com/starter/city',
    );

    const cities = await this.db.city.createMany({
      data: res.data.rajaongkir.results.map((val) => {
        return {
          city_id: val.city_id,
          city_name: val.city_name,
          province_id: val.province_id,
          type: val.type,
          postcal_code: val.postal_code,
        };
      }),
    });

    return cities;
  }
}
