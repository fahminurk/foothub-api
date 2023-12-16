import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.db.user.findMany();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.db.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    delete user.password;
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.db.user.findUnique({ where: { email } });

    return user;
  }

  async createUser(
    data: Partial<User>,
    file?: Express.Multer.File,
  ): Promise<User> {
    const existing = await this.getUserByEmail(data.email);

    if (existing) throw new ConflictException('User already exists');

    const hashedPassword = await hash(data.password, 10);

    const user = await this.db.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        isVerified: data.isVerified,
        avatarUrl: file.filename ? 'static/user/' + file?.filename : null,
        password: hashedPassword,
      },
    });

    delete user.password;
    return user;
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.getUserById(id);

    if (!user) throw new NotFoundException('User not found');

    return this.db.user.delete({ where: { id } });
  }

  async updateUser(
    id: number,
    data: Partial<User>,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.getUserById(id);

    if (!user) throw new NotFoundException('User not found');

    return this.db.user.update({
      where: { id },
      data: {
        ...data,
        avatarUrl: 'static/user/' + file?.filename,
      },
    });
  }
}
