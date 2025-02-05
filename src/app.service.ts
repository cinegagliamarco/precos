import { Injectable } from '@nestjs/common';
import axios from "axios";
import { load } from "cheerio";

@Injectable()
export class AppService {
  public import(): string {
    return 'Hello World!';
  }
}
