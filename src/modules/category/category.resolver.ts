import { CategoryService } from './category.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CategoryModel } from '@/src/modules/category/models/category.model';

@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [CategoryModel])
  async findAllCategories() {
    return this.categoryService.findAll();
  }

  @Query(() => [CategoryModel])
  async findRandomCategories() {
    return this.categoryService.findRandomCategories();
  }

  @Query(() => CategoryModel)
  async findCategoryBySlug(@Args('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }
}
