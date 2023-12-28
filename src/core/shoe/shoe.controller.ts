import {
  Body,
  Controller,
  Delete,
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
import { CreateShoeDto } from './shoe.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { AuthGuard } from '../auth/auth.guard';

@Controller('shoe')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}

  @Get()
  findAll(
    @Query() query: { brand?: string; category?: string; subcategory?: string },
  ) {
    console.log(query);

    return this.shoeService.getAllProduct(query);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.shoeService.getProductById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
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

  @Delete()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  delete() {
    return this.shoeService.deleteAllProduct();
  }

  @Post('size')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  createShoeSize(@Body() data: { size: string }) {
    return this.shoeService.createShoeSize(data);
  }
}
