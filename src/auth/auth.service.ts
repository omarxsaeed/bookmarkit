import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDTO) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: { email: dto.email, password: hash },
      });

      delete user.password;

      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Email already exists');
      }
      throw error;
    }
  }

  async login(dto: AuthDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ForbiddenException('Incorrect credentials');
    }

    const isPasswordValid = await argon.verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Incorrect credentials');
    }

    delete user.password;

    return user;
  }
}
