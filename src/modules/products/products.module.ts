import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from 'src/lib/passport/services/token.service';
import { UserAccessTokenService } from '../auth/services/user-access-token.service';
import { ProductsController } from './controllers/products.controller';
import { Product } from './entities/product.entity';
import { ProductsService } from './services/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService, TokenService, UserAccessTokenService],
  exports: [ProductsService],
})
export class ProductsModule {}
