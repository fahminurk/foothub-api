import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ShoeService } from './shoe.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateShoeDto } from './shoe.dto';

@Controller('shoe')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}

  @Get()
  findAll() {
    return this.shoeService.getAllProduct();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.shoeService.getProductById(id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: diskStorage({
        destination: './uploads/static/shoe',
        filename(req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
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
}
