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
import { ProductsService } from './products.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/entities/category.entity';

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
      title: 'Product List',
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
    const result = await this.categoriesService.findAll('', 1, 100);
    const categories = result.data as Category[];

    categories.sort((a, b) => a.name.localeCompare(b.name));

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
  async create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    const result = await this.productsService.create(createProductDto);

    req.session.flash = {
      type: 'success',
      title: 'Produk Ditambahkan',
      message: 'Data produk baru berhasil disimpan.',
    };

    return result;
  }

  @Get('edit/:id')
  @Render('products/form')
  async editForm(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);

    const result = await this.categoriesService.findAll('', 1, 100);
    const categories = result.data as Category[];

    categories.sort((a, b) => a.name.localeCompare(b.name));

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
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any,
  ) {
    const result = await this.productsService.update(+id, updateProductDto);

    req.session.flash = {
      type: 'success',
      title: 'Update Berhasil',
      message: 'Data produk berhasil diperbarui.',
    };

    return result;
  }

  @Get('delete/:id')
  @Redirect('/products')
  async remove(@Param('id') id: string, @Req() req: any) {
    const result = await this.productsService.remove(+id);

    req.session.flash = {
      type: 'success',
      title: 'Produk Dihapus',
      message: 'Data produk telah dihapus dari database.',
    };

    return result;
  }

  @Get(':id')
  @Render('products/details')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);

    if (!product) {
      return { title: 'Product Not Found', product: null, path: '/products' };
    }

    const stockStatus = this.productsService.getStockStatus(product.stock);

    return {
      title: `${product.name} - Detail Produk`,
      product: product,
      stockStatus: stockStatus,
      path: '/products',
    };
  }
}
