import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() data: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.createUser(data, file);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  delete(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @Body() data: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);

    await this.userService.updateUser(id, data, file);

    const user = await this.userService.getUserById(id);

    if (user.role === 'USER') {
      delete user.password;

      const accessToken = this.jwtService.sign(user);

      return { user, accessToken };
    }
    return user;
  }
}
