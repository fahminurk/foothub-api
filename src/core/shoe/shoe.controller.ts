import { Controller } from '@nestjs/common';
import { ShoeService } from './shoe.service';

@Controller('shoe')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}
}
