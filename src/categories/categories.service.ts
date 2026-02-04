import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async countAll(): Promise<number> {
    return await this.categoryRepository.count();
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(createCategoryDto);
  }

  // async findAll(search?: string): Promise<any[]> {
  //   const whereCondition: FindOptionsWhere<Category> = {};

  //   if (search) {
  //     whereCondition.name = ILike(`%${search}%`);
  //   }

  //   const queryBuilder = this.categoryRepository
  //     .createQueryBuilder('category')
  //     .leftJoinAndSelect('category.products', 'product')
  //     .loadRelationCountAndMap('category.productCount', 'category.products');

  //   if (search) {
  //     queryBuilder.where('category.name ILIKE :search', {
  //       search: `%${search}%`,
  //     });
  //   }

  //   return await queryBuilder.orderBy('category.id', 'DESC').getMany();
  // }
  // Tambahkan parameter page dan limit
  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 8,
  ): Promise<{ data: any[]; total: number }> {
    // 1. Inisialisasi QueryBuilder (tetap pertahankan hitungan produk)
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product')
      .loadRelationCountAndMap('category.productCount', 'category.products');

    // 2. Jika ada pencarian
    if (search) {
      queryBuilder.where('category.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // 3. Tambahkan Logika Pagination
    queryBuilder
      .orderBy('category.id', 'DESC')
      .take(limit) // Ambil sekian data
      .skip((page - 1) * limit); // Lewati sekian data

    // 4. Ambil data dan total baris sekaligus
    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    return await this.categoryRepository.delete(id);
  }
}
