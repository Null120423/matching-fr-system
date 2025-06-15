import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('gateway')
@Controller()
export class AppController {
  constructor() {}
}
