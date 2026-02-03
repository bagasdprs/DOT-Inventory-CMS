import { Controller, Get, Render } from '@nestjs/common';
import { ProductsService } from './products/products.service';
import { CategoriesService } from './categories/categories.service';

@Controller()
export class AppController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  @Render('index')
  async dashboard() {
    const [
      totalProducts,
      totalValue,
      recentProducts,
      lowStockProducts,
      totalCategories,
    ] = await Promise.all([
      this.productsService.countAll(),
      this.productsService.getTotalValue(),
      this.productsService.findRecent(),
      this.productsService.findLowStockSimple(),
      this.categoriesService.countAll(),
    ]);

    return {
      title: 'Dashboard Overview',
      path: '/',
      stats: {
        totalProducts,
        totalValue,
        lowStockCount: lowStockProducts.length,
        totalCategories,
      },
      recentProducts,
      lowStockProducts,
    };
  }
}
