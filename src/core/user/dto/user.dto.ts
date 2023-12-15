import { Contains, IsString, Length, IsNumberString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(3)
  name: string;

  @IsString()
  @Contains('08')
  @Length(11, 12)
  @IsNumberString()
  phone: string;
}
