import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/lib/passport/guards/jwt-auth.guard';
import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private usersService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(@Body() request: any) {
    return { message: 'hello' };
  }
}
