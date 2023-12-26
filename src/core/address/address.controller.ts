import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CreateAddressDto } from './address.dto';
import { PayloadJwt } from './types';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  create(@Body() data: CreateAddressDto, @Req() req: Express.Request) {
    const user = req.user as PayloadJwt;
    console.log(user);

    return this.addressService.createAddress(data, user.id);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  getAddress(@Req() req: Express.Request) {
    const user = req.user as PayloadJwt;
    return this.addressService.getAddressUser(user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  delete(@Req() req: Express.Request, @Param('id') id: number) {
    return this.addressService.deleteAddress(id);
  }
}
