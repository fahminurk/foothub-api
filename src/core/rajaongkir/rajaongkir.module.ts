import { Module } from '@nestjs/common';
import { RajaongkirService } from './rajaongkir.service';
import { RajaongkirController } from './rajaongkir.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [RajaongkirController],
  providers: [RajaongkirService],
  imports: [
    HttpModule.register({
      headers: { key: process.env.RAJA_ONGKIR_API_KEY },
    }),
  ],
})
export class RajaongkirModule {}
