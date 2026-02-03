import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Redirect,
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
  async findAll() {
    const products = await this.productsService.findAll();
    const [totalProducts, totalValue, lowStockProducts] = await Promise.all([
      this.productsService.countAll(),
      this.productsService.getTotalValue(),
      this.productsService.findLowStockSimple(),
    ]);

    return {
      products,
      title: 'Daftar Produk',
      path: '/products',
      stats: {
        totalProducts,
        totalValue,
        lowStock: lowStockProducts.length,
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
