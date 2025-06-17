import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  sayHello(data: { name: string }): { message: string } {
    return { message: `Hello, ${data.name}` };
  }
}
