import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
  Render,
  Redirect,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Render('categories/index')
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      categories,
      title: 'Category Management',
      path: '/categories',
    };
  }

  @Get('create')
  @Render('categories/form')
  createForm() {
    return {
      title: 'New Category',
      type: 'create',
      category: null,
      path: '/categories',
    };
  }

  @Post()
  @Redirect('/categories')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('edit/:id')
  @Render('categories/form')
  async editForm(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(+id);
    return {
      title: 'Edit Category',
      type: 'edit',
      category: category,
      path: '/categories',
    };
  }

  @Post('update/:id')
  @Redirect('/categories')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Get('delete/:id')
  @Redirect('/categories')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
