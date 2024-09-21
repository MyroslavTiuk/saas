import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExcelService } from './excel.service';
import { SuperUserGuard } from '../guard/super-user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerExcelOptions } from '../../config/multer.config';
import { ImportExcelDto } from './dto/import-excel.dto';
import { UserEntity } from '../../database/entities/user.entity';

@Controller('admin/excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @UseGuards(SuperUserGuard)
  @Post('import')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('csv_file', multerExcelOptions))
  importExcel(
    @Req() req: any,
    @Query() query: ImportExcelDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file != null) {
      const user = <UserEntity>req.user;
      return this.excelService.importExcel(user, query, file);
    }
    throw new HttpException('No File', HttpStatus.BAD_REQUEST);
  }
}
