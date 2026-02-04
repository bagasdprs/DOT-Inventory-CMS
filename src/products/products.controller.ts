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
import { ProductsService } from './products.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  @Render('products/index')
  async findAll(
    @Query('search') search: string,
    @Query('categoryId') categoryId: string,
    @Query('page') page: number = 1,
  ) {
    const limit = 10;

    const { data, total } = await this.productsService.findAll(
      search,
      categoryId,
      page,
      limit,
    );

    const { data: categories } = await this.categoriesService.findAll();

    const totalPages = Math.ceil(total / limit);

    const [totalValue, lowStockProducts] = await Promise.all([
      this.productsService.getTotalValue(),
      this.productsService.findLowStockSimple(),
    ]);

    return {
      products: data,
      categories,
      title: 'Daftar Produk',
      path: '/products',
      stats: {
        totalProducts: total,
        totalValue,
        lowStock: lowStockProducts.length,
      },
      query: { search, categoryId },

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
  @Render('products/form')
  async createForm() {
    const categories = await this.categoriesService.findAll();
    return {
      title: 'Tambah Produk Baru',
      type: 'create',
      product: null,
      categories: categories,
      path: '/products',
    };
  }

  @Post()
  @Redirect('/products')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('edit/:id')
  @Render('products/form')
  async editForm(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);
    const categories = await this.categoriesService.findAll();

    return {
      title: 'Edit Produk',
      type: 'edit',
      product: product,
      categories: categories,
      path: '/products',
    };
  }

  @Post('update/:id')
  @Redirect('/products')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Get('delete/:id')
  @Redirect('/products')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
