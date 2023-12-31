import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  @IsNumberString()
  stock: string;

  @IsNotEmpty()
  @IsNumberString()
  shoeId: string;

  @IsNotEmpty()
  @IsNumberString()
  sizeId: string;
}
