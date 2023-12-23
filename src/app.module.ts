import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ShoeModule } from './core/shoe/shoe.module';
import { CategoryModule } from './core/category/category.module';
import { BrandModule } from './core/brand/brand.module';
import { SubCategoryModule } from './core/sub-category/sub-category.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CloudinaryModule } from './core/cloudinary/cloudinary.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ShoeModule,
    CategoryModule,
    BrandModule,
    SubCategoryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
