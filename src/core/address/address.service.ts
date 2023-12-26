import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly db: PrismaService) {}

  async getAddressUser(userId: number) {
    return this.db.address.findMany({
      where: { userId },
    });
  }

  async createAddress(data: CreateAddressDto, userId: number) {
    return await this.db.address.create({
      data: {
        ...data,
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
