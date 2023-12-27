import {
  Contains,
  IsString,
  Length,
  IsNumberString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  addressDetails: string;

  @IsNotEmpty()
  @IsString()
  @Contains('08')
  @Length(11, 12)
  @IsNumberString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  city_id: string;

  // @IsNotEmpty()
  // @IsString()
  // postcal_code: string;

  // @IsNotEmpty()
  // @IsString()
  // latitude: string;

  // @IsNotEmpty()
  // @IsString()
  // longtitude: string;

  @IsNotEmpty()
  @IsBoolean()
  isPrimary: boolean;

  // @IsNotEmpty()
  // @IsNumberString()
  // userId: number;
}

// model Address {
//   id              Int     @id   @default(autoincrement())
//   title           String
//   name            String
//   phone           String
//   address         String
//   addressDetails  String
//   cityId          String
//   city            City    @relation(fields: [cityId], references: [city_id])
//   postcode        Int
//   latitude        String
//   longtitude      String
//   isPrimary       Boolean
//   userId          Int
//   user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)
// }
