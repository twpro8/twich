import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Category } from '@prisma/generated/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: { streams: { include: { user: true } } },
    });
  }

  async findRandomCategories() {
    const LIMIT = 7;

    // todo: optimization

    return this.prismaService.$queryRaw<Category[]>`
      SELECT *
      FROM "categories"
      ORDER BY RANDOM()
      LIMIT ${LIMIT}
    `;
  }

  async findBySlug(slug: string) {
    const category = await this.prismaService.category.findUnique({
      where: { slug },
      include: {
        streams: {
          include: {
            user: true,
            category: true,
          },
        },
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    return category;
  }
}
