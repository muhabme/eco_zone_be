import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/lib/services/crud.service';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService extends CrudService<Product> {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {
    super({ entity: Product });
  }
}
