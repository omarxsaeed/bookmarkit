import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookmarks(userId: number) {
    return await this.prisma.bookmark.findMany({ where: { userId } });
  }

  async getBookmark(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId, userId },
    });
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

  async updateBookmark(
    userId: number,
    bookmarkId: number,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    const bookmark = await this.getBookmark(userId, bookmarkId);

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: { ...updateBookmarkDto },
    });
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.getBookmark(userId, bookmarkId);

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.bookmark.delete({ where: { id: bookmarkId } });
  }
}
