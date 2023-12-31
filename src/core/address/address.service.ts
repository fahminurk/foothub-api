import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './address.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CityProvinceService } from '../city-province/city-province.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AddressService {
  constructor(
    private readonly db: PrismaService,
    private readonly CityProvinceService: CityProvinceService,
    private readonly httpService: HttpService,
  ) {}

  async getAddressUser(userId: number) {
    return this.db.address.findMany({
      where: { userId },
      include: { city: { include: { province: true } } },
    });
  }

  async createAddress(data: CreateAddressDto, userId: number) {
    const city = await this.CityProvinceService.getCityById(data.city_id);

    const res = await this.httpService.axiosRef.get(
      'https://api.opencagedata.com/geocode/v1/json',
      {
        params: {
          q: `${data.address}, ${city[0].city_name},${city[0].province.province}`,
          countrycode: 'id',
          limit: 1,
          key: process.env.OPENCAGE_API_KEY,
        },
      },
    );

    return await this.db.address.create({
      data: {
        ...data,
        postcal_code: city[0].postcal_code,
        latitude: res.data.results[0].geometry.lat,
        longitude: res.data.results[0].geometry.lng,
        userId,
      },
    });
  }

  async deleteAddress(id: number) {
    return await this.db.address.delete({ where: { id } });
  }

  // async updateAddress(id: number, data: Partial<CreateAddressDto>) {
  //   return await this.db.address.update({
  //     where: {},
  //     data,
  //   });
  // }
}
