import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({ where: { userId } });
  }

  async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        ...createBookmarkDto,
        user: { connect: { id: userId } },
      },
    });
    return bookmark;
  }
}
