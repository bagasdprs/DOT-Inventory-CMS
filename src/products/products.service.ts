import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category'],
      order: { id: 'DESC' },
    });
  }

  async countAll(): Promise<number> {
    return this.productRepository.count();
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async getTotalValue(): Promise<number> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.price * product.stock)', 'total')
      .getRawOne<{ total: string | null }>();
    return result && result.total ? Number(result.total) : 0;
  }

  async findLowStock(): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        stock: LessThanOrEqual(5),
      },
      order: { stock: 'ASC' },
      take: 5,
    });
  }

  async findLowStockSimple(): Promise<Product[]> {
    const all = await this.findAll();
    return all.filter((p) => p.stock <= 5).slice(0, 5);
  }

  async findRecent(): Promise<Product[]> {
    return this.productRepository.find({
      order: { id: 'DESC' },
      take: 5,
      relations: ['category'],
    });
  }

  async create(createProductDto: CreateProductDto) {
    const product = new Product();
    product.name = createProductDto.name;
    product.price = createProductDto.price;
    product.stock = createProductDto.stock;
    product.description = createProductDto.description;

    if (createProductDto.categoryId) {
      const category = new Category();
      category.id = +createProductDto.categoryId;
      product.category = category;
    }

    return await this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { categoryId, ...data } = updateProductDto;
    const product = await this.productRepository.preload({
      id: +id,
      ...data,
      category: categoryId ? { id: +categoryId } : undefined,
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    return await this.productRepository.delete(id);
  }
}
