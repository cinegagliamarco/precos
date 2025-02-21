import { Controller, Get } from '@nestjs/common';
import { BaseProductService } from '../services/base-product.service';

@Controller('products/base')
export class BaseProductController {
  constructor(private readonly baseProductService: BaseProductService) {}

  @Get('/import')
  public import() {
    return this.baseProductService.import();
  }
}
