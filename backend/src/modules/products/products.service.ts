import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductImageData, ProductStatus } from './product.entity';
import { StorageService } from '../storage/storage.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

export type ProductDto = Omit<Product, 'images'> & {
  images: (ProductImageData & { id: string })[];
};

export interface PaginatedProducts {
  data: ProductDto[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
    private readonly storage: StorageService,
  ) {}

  async findAll(query: ProductQueryDto): Promise<PaginatedProducts> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const qb = this.repo.createQueryBuilder('p');

    if (query.category?.length) {
      qb.andWhere('p.category IN (:...categories)', {
        categories: query.category,
      });
    }
    if (query.subCategory?.length) {
      qb.andWhere('p.subCategory IN (:...subCategories)', {
        subCategories: query.subCategory,
      });
    }
    if (query.brand) {
      qb.andWhere('LOWER(p.brand) = LOWER(:brand)', { brand: query.brand });
    }
    if (query.status === 'all') {
      // no filter — admin sees all statuses
    } else if (query.status) {
      qb.andWhere('p.status = :status', { status: query.status });
    } else {
      qb.andWhere('p.status = :status', { status: ProductStatus.Active });
    }
    if (query.minPrice !== undefined) {
      qb.andWhere('p.price >= :min', { min: query.minPrice });
    }
    if (query.maxPrice !== undefined) {
      qb.andWhere('p.price <= :max', { max: query.maxPrice });
    }
    if (query.search) {
      qb.andWhere('(LOWER(p.name) LIKE :q OR LOWER(p.brand) LIKE :q)', {
        q: `%${query.search.toLowerCase()}%`,
      });
    }
    if (query.size) {
      // simple-array stores as "40,41,42" — wrap with commas to avoid partial matches
      qb.andWhere(`(',' || p.sizes || ',') LIKE :sizePattern`, {
        sizePattern: `%,${query.size},%`,
      });
    }

    switch (query.sort) {
      case 'price-asc':
        qb.orderBy('p.price', 'ASC');
        break;
      case 'price-desc':
        qb.orderBy('p.price', 'DESC');
        break;
      case 'popular':
        qb.orderBy('p.reviewCount', 'DESC');
        break;
      default:
        qb.orderBy('p.createdAt', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const [products, total] = await qb.getManyAndCount();
    return {
      data: products.map((p) => this.withImageIds(p)),
      total,
      page,
      limit,
    };
  }

  async getFeatured(): Promise<ProductDto[]> {
    const featured = await this.repo.find({
      where: { status: ProductStatus.Active, isNew: true },
      order: { createdAt: 'DESC' },
      take: 6,
    });

    if (featured.length >= 6) {
      return featured.map((p) => this.withImageIds(p));
    }

    // fallback: fill remaining slots from latest active products
    const ids = featured.map((p) => p.id);
    const qb = this.repo
      .createQueryBuilder('p')
      .where('p.status = :status', { status: ProductStatus.Active })
      .orderBy('p.createdAt', 'DESC')
      .take(6 - featured.length);

    if (ids.length > 0) {
      qb.andWhere('p.id NOT IN (:...ids)', { ids });
    }

    const rest = await qb.getMany();
    return [...featured, ...rest].map((p) => this.withImageIds(p));
  }

  async getSale(): Promise<ProductDto[]> {
    const products = await this.repo
      .createQueryBuilder('p')
      .where('p.status = :status', { status: ProductStatus.Active })
      .andWhere('p.originalPrice IS NOT NULL')
      .orderBy('(p.originalPrice - p.price)', 'DESC')
      .getMany();

    return products.map((p) => this.withImageIds(p));
  }

  async getBySlug(slug: string): Promise<ProductDto> {
    const product = await this.repo.findOne({ where: { slug } });
    if (!product) throw new NotFoundException('Product not found');
    return this.withImageIds(product);
  }

  async create(dto: CreateProductDto): Promise<ProductDto> {
    const baseSlug = this.toSlug(`${dto.brand} ${dto.name}`);
    const slug = await this.ensureUniqueSlug(baseSlug);

    const product = this.repo.create({
      ...dto,
      slug,
      sizes: dto.sizes ?? [],
      images: dto.images ?? [],
      status: dto.status ?? ProductStatus.Draft,
      isNew: dto.isNew ?? false,
    });

    const saved = await this.repo.save(product);
    return this.withImageIds(saved);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDto> {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Regenerate slug if brand or name changed
    if (dto.brand !== undefined || dto.name !== undefined) {
      const brand = dto.brand ?? product.brand;
      const name = dto.name ?? product.name;
      const newBase = this.toSlug(`${brand} ${name}`);
      if (newBase !== product.slug) {
        product.slug = await this.ensureUniqueSlug(newBase, id);
      }
    }

    Object.assign(product, dto);
    const saved = await this.repo.save(product);
    return this.withImageIds(saved);
  }

  async remove(id: string): Promise<void> {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.repo.remove(product);
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    const url = await this.storage.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
    return { url };
  }

  private withImageIds(product: Product): ProductDto {
    return {
      ...product,
      images: (product.images ?? []).map((img: ProductImageData) => ({
        ...img,
        id: img.url,
      })),
    };
  }

  private toSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private async ensureUniqueSlug(
    base: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = base;
    let suffix = 1;
    for (;;) {
      const qb = this.repo
        .createQueryBuilder('p')
        .where('p.slug = :slug', { slug });
      if (excludeId) {
        qb.andWhere('p.id != :id', { id: excludeId });
      }
      const existing = await qb.getOne();
      if (!existing) return slug;
      slug = `${base}-${suffix++}`;
    }
  }
}
