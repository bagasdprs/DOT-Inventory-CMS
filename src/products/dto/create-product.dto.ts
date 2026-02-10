import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsUrl,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  @Transform(({ value }) => (value === '' ? null : value))
  image_url?: string;

  @IsOptional()
  @IsString()
  sku?: string;
}
