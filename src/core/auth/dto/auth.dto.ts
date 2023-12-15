import {
  Contains,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsNumberString,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;
}

export class RegisterDto extends LoginDto {
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
}
