import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PayloadService } from './payload.service';
import { UserGuard } from '../guard/user.guard';

@Controller('admin/payload')
export class PayloadController {
  constructor(private readonly payloadService: PayloadService) {}

  @UseGuards(UserGuard)
  @Get('get_payloads')
  @HttpCode(HttpStatus.OK)
  getList() {
    return this.payloadService.getPayloads();
  }
}
