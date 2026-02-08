import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Redirect,
  Query,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Render('categories/index')
  async findAll(
    @Query('search') search: string,
    @Query('page') page: number = 1,
  ) {
    const limit = 8;

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
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: any) {
    const result = await this.categoriesService.create(createCategoryDto);

    req.session.flash = {
      type: 'success',
      title: 'Berhasil!',
      message: 'Kategori baru berhasil ditambahkan.',
    };

    return result;
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

  @Get(':id')
  @Render('categories/details')
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(+id);
    const totalItems = category.products.length;
    const totalAssetValue = category.products.reduce((total, product) => {
      return total + product.price * product.stock;
    }, 0);

    const lowStockItems = category.products.filter((p) => p.stock <= 10);
    const lowStockCount = lowStockItems.length;

    return {
      title: `Detail Kategori: ${category.name}`,
      category: category,
      stats: {
        totalItems,
        totalAssetValue,
        lowStockCount,
        lowStockItems,
      },
      user: { name: 'Admin' },
    };
  }

  @Post('update/:id')
  @Redirect('/categories')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: any,
  ) {
    const result = await this.categoriesService.update(+id, updateCategoryDto);

    req.session.flash = {
      type: 'success',
      title: 'Update Berhasil!',
      message: 'Data kategori berhasil diperbarui.',
    };
    return result;
  }

  @Get('delete/:id')
  @Redirect('/categories')
  async remove(@Param('id') id: string, @Req() req: any) {
    const result = await this.categoriesService.remove(+id);

    req.session.flash = {
      type: 'success',
      title: 'Terhapus!',
      message: 'Kategori berhasil dihapus.',
    };

    return result;
  }
}
