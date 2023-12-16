import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.signIn(data.email, data.password);
  }

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.signUp(data);
  }
}
