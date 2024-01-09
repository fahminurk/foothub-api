import { BadRequestException, Injectable } from '@nestjs/common';
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
      orderBy: { ['isPrimary']: 'desc' },
    });
  }

  async createAddress(data: CreateAddressDto, userId: number) {
    const res = await this.openCage(data);
    const addressCheck = await this.getAddressUser(userId);
    const isPrimary = addressCheck.length > 0 ? data.isPrimary : true;

    if (isPrimary && addressCheck.length > 0) {
      const addressPrimary = await this.primaryChecker(userId);
      await this.updatePrimary(addressPrimary.id);
    }

    return await this.db.address.create({
      data: {
        ...data,
        isPrimary,
        postcal_code: res.city[0].postcal_code,
        latitude: res.openCage.data.results[0].geometry.lat,
        longitude: res.openCage.data.results[0].geometry.lng,
        userId,
      },
    });
  }

  async deleteAddress(id: number, userId: number) {
    const addressToDelete = await this.db.address.findUnique({ where: { id } });

    if (!addressToDelete) throw new BadRequestException('address not found');

    if (addressToDelete.isPrimary) {
      const otherAddress = await this.db.address.findFirst({
        where: { userId, NOT: { id: addressToDelete.id } },
      });

      if (otherAddress) {
        await this.db.address.update({
          where: { id: otherAddress.id },
          data: { isPrimary: true },
        });
      }
    }
    return await this.db.address.delete({ where: { id } });
  }

  async updateAddress(id: number, data: CreateAddressDto, userId: number) {
    const res = await this.openCage(data);
    const checkPrimary = await this.primaryChecker(userId);
    const checkAddress = await this.db.address.findUnique({
      where: { id },
    });

    if (!data.isPrimary && id == checkPrimary.id) {
      throw new BadRequestException('you need 1 default address');
    } else if (data.isPrimary && checkPrimary.id != checkAddress.id) {
      await this.editPrimary(userId, checkPrimary.id);
    }

    return await this.db.address.update({
      where: { id },
      data: {
        ...data,
        isPrimary: data.isPrimary,
        postcal_code: res.city[0].postcal_code,
        latitude: res.openCage.data.results[0].geometry.lat,
        longitude: res.openCage.data.results[0].geometry.lng,
      },
    });
  }

  async primaryChecker(userId: number) {
    return await this.db.address.findFirst({
      where: { isPrimary: true, userId },
    });
  }

  async updatePrimary(id: number) {
    return await this.db.address.update({
      where: { id },
      data: { isPrimary: false },
    });
  }

  async editPrimary(userId: number, id: number) {
    return this.db.address.update({
      where: { id, userId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  async openCage(data: CreateAddressDto) {
    const city = await this.CityProvinceService.getCityById(data.city_id);

    const openCage = await this.httpService.axiosRef.get(
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

    return { city, openCage };
  }
}
