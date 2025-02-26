import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  public getHealth(): { status: string } {
    return { status: 'OK' };
  }
}
