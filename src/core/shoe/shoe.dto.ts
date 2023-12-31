import { IsString, IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { ShoeStatus } from '@prisma/client';

export class CreateShoeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @IsNotEmpty()
  @IsNumberString()
  weight: number;

  @IsEnum(ShoeStatus)
  status: ShoeStatus;

  @IsNotEmpty()
  @IsNumberString()
  brandId: number;

  @IsNotEmpty()
  @IsNumberString()
  categoryId: number;

  @IsNotEmpty()
  @IsNumberString()
  subcategoryId: number;
}

export class CreateSizeDto {
  @IsNotEmpty()
  @IsNumberString()
  size: string;
}
