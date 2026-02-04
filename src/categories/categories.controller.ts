import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Redirect,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // @Get()
  // @Render('categories/index')
  // async findAll(@Query('search') search: string) {
  //   const categories = await this.categoriesService.findAll(search);

  //   return {
  //     categories,
  //     title: 'Categories Management',
  //     path: '/categories',
  //     query: { search },
  //   };
  // }
  @Get()
  @Render('categories/index')
  async findAll(
    @Query('search') search: string,
    @Query('page') page: number = 1, // Tangkap halaman, default 1
  ) {
    const limit = 8; // Kita set 8 saja supaya pas di grid (4 kolom x 2 baris)

    // 1. Panggil service (sekarang dapet { data, total })
    const { data, total } = await this.categoriesService.findAll(
      search,
      page,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      categories: data,
      title: 'Categories Management',
      path: '/categories',
      query: { search },
      // Info pagination untuk tombol < dan >
      pagination: {
        currentPage: Number(page),
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: Number(page) + 1,
        prevPage: Number(page) - 1,
      },
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
