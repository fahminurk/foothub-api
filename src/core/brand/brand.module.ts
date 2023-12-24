import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [CloudinaryModule],
})
export class BrandModule {}
