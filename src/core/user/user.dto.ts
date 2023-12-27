import { Role } from '@prisma/client';
import {
  Contains,
  IsString,
  Length,
  IsNumberString,
  IsEnum,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Contains('08')
  @Length(11, 12)
  @IsNumberString()
  phone: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Contains('08')
  @Length(11, 12)
  @IsNumberString()
  phone: string;

  // @IsEnum(Role)
  // role?: Role;
}
