import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/import/drogasil')
  public importDrogasil() {
    return this.productService.importDrogasil();
  }

  @Get('/import/drogal')
  public importDrogal() {
    return this.productService.importDrogal();
  }
}
