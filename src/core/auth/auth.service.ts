import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new NotFoundException('user not found');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException('invalid password');

    delete user.password;

    const accessToken = this.jwtService.sign(user);

    return { user, accessToken };
  }

  async signUp(data: RegisterDto) {
    const existing = await this.userService.getUserByEmail(data.email);

    if (existing) throw new ConflictException('user already exists');

    const user = await this.userService.createUser(data);

    const accessToken = this.jwtService.sign(user);

    return { user, accessToken };
  }
}
