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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBrandDto } from './brand.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  findAll() {
    return this.brandService.getAllBrands();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.brandService.getBrandById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() data: CreateBrandDto,
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
    return this.brandService.createBrand(data, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  delete(@Param('id') id: number) {
    return this.brandService.deleteShoe(id);
  }
}
