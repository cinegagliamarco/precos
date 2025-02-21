import { Controller, Get } from '@nestjs/common';
import { BaseProductService } from '../services/base-product.service';
import { GenericProductService } from '../services/generic-product.service';

@Controller('products/generic')
export class GenericProductController {
  constructor(private readonly genericProductService: GenericProductService) {}

  @Get('/import')
  public import() {
    return this.genericProductService.import();
  }
}
