import { Module } from '@nestjs/common';
import { ShoeService } from './shoe.service';
import { ShoeController } from './shoe.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [ShoeController],
  providers: [ShoeService],
  imports: [CloudinaryModule],
})
export class ShoeModule {}
