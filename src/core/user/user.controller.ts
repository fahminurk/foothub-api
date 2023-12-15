import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UpdateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  create(@Body() data: RegisterDto) {
    return this.userService.createUser(data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(id, data);
  }
}
