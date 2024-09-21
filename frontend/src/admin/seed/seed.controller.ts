import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('admin/seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('step1')
  @HttpCode(HttpStatus.OK)
  step1() {
    return this.seedService.step1();
  }

  @Get('step2')
  @HttpCode(HttpStatus.OK)
  step2() {
    return this.seedService.step2();
  }

  /**
   * @deprecated
   */
  @Get('step3')
  @HttpCode(HttpStatus.OK)
  step3() {
    return this.seedService.step3();
  }

  /**
   * @deprecated
   */
  @Get('step4')
  @HttpCode(HttpStatus.OK)
  step4() {
    return this.seedService.step4();
  }

  /**
   * @deprecated
   */
  @Get('step5')
  @HttpCode(HttpStatus.OK)
  step5() {
    return this.seedService.step5();
  }

  /**
   * @deprecated
   */
  @Get('step6')
  @HttpCode(HttpStatus.OK)
  step6() {
    return this.seedService.step6();
  }

  /**
   * @deprecated
   */
  @Get('step7')
  @HttpCode(HttpStatus.OK)
  step7() {
    return this.seedService.step7();
  }
}
