import { Controller, Get, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from './products/products.service';
import { CategoriesService } from './categories/categories.service';
import { UserPayload } from './auth/auth.service';

interface DashboardSession {
  user?: UserPayload;
}

@Controller()
export class AppController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  async dashboard(@Session() session: DashboardSession, @Res() res: Response) {
    if (!session.user) {
      return res.redirect('/auth/login');
    }

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

    return res.render('index', {
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
      user: session.user,
    });
  }
}
