import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CityProvinceService {
  constructor(private readonly db: PrismaService) {}

  async getAllProvinces() {
    return await this.db.province.findMany();
  }

  async getAllCities() {
    return await this.db.city.findMany({ include: { province: true } });
  }

  async getCityByProv(province_id: string) {
    return await this.db.city.findMany({
      where: { province_id },
      include: { province: true },
    });
  }
}
