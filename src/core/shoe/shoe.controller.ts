import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ShoeService } from './shoe.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateShoeDto, CreateSizeDto } from './shoe.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { AuthGuard } from '../auth/auth.guard';
import { QueryProduct } from './types';

@Controller('shoe')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}

  @Get()
  findAll(@Query() query: QueryProduct) {
    return this.shoeService.getAllProduct(query);
  }

  @Get('size')
  getAllSize() {
    return this.shoeService.getAllSize();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.shoeService.getProductById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @UseInterceptors(FilesInterceptor('files', 3))
  create(
    @Body() data: CreateShoeDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.shoeService.createProduct(data, files);
  }

  // @Delete()
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.SuperAdmin)
  // delete() {
  //   return this.shoeService.deleteAllProduct();
  // }

  @Post('size')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  createShoeSize(@Body() data: CreateSizeDto) {
    return this.shoeService.createShoeSize(data);
  }
}
