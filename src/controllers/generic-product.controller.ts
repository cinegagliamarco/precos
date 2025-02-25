import { Controller, Get } from '@nestjs/common';

@Controller('products/generic')
export class GenericProductController {
  @Get('/import')
  public import() {
    // return this.genericProductService.import();
  }
}
