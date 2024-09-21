import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SuperUserGuard } from '../guard/super-user.guard';
import { EmployeeService } from './employee.service';
import { GetAccountNoDescListDto } from './dto/get-account-no-desc-list.dto';
import { GetPaypointDescListDto } from './dto/get-paypoint-desc-list.dto';
import { UserGuard } from '../guard/user.guard';
import { GetEmployeesDto } from './dto/get-employees.dto';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { GetEmployeeByNoDto } from './dto/get-employee-by-no.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { ChangeEmployeeStatusDto } from './dto/change-employee-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerArchiveOptions, multerAvatarOptions } from '../../config/multer.config';
import { EmployeeArchiveFileDto } from './dto/employee-archive-file.dto';
import { EmployeeArchiveDto } from './dto/employee-archive.dto';
import { GetArchivedEmployeesDto } from './dto/get-archived-employees.dto';
import { EmployeeAvatarDto } from './dto/employee-avatar.dto';
import { join } from 'path';
import { of } from 'rxjs';

@Controller('admin/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @UseGuards(UserGuard)
  @Get('get_admin_no_desc_list')
  @HttpCode(HttpStatus.OK)
  getAccountNoDescList(@Req() req: any, @Query() query: GetAccountNoDescListDto) {
    const user = <UserEntity>req.user;
    return this.employeeService.getAccountNoDescList(query, user);
  }

  @UseGuards(UserGuard)
  @Get('get_paypoint_desc_list')
  @HttpCode(HttpStatus.OK)
  getPaypointDescList(@Req() req: any, @Query() query: GetPaypointDescListDto) {
    const user = <UserEntity>req.user;
    return this.employeeService.getPaypointDescList(query, user);
  }

  @UseGuards(UserGuard)
  @Get('get_employees')
  @HttpCode(HttpStatus.OK)
  getEmployees(@Req() req: any, @Query() params: GetEmployeesDto) {
    const user = <UserEntity>req.user;
    return this.employeeService.getEmployees(params, user.id);
  }

  @UseGuards(SuperUserGuard)
  @Post('add_employee')
  @HttpCode(HttpStatus.CREATED)
  addEmployee(@Req() req: any, @Body() body: AddEmployeeDto) {
    const user = <UserEntity>req.user;
    return this.employeeService.addEmployee(user, body);
  }

  @UseGuards(UserGuard)
  @Get('get_employee')
  @HttpCode(HttpStatus.OK)
  getEmployee(@Query() query: GetEmployeeByNoDto) {
    return this.employeeService.getEmployeeById(query);
  }
  @UseGuards(SuperUserGuard)
  @Put('update_employee')
  @HttpCode(HttpStatus.OK)
  updateEmployee(@Body() body: UpdateEmployeeDto) {
    return this.employeeService.updateEmployee(body);
  }

  @UseGuards(SuperUserGuard)
  @Delete('delete_employee')
  @HttpCode(HttpStatus.OK)
  deleteEmployee(@Query() query: DeleteEmployeeDto) {
    return this.employeeService.deleteEmployee(query);
  }

  // @UseGuards(UserGuard)
  @Get('profile_image/:image_name')
  @HttpCode(HttpStatus.OK)
  getUserProfile(@Param('image_name') image_name, @Res() res) {
    return of(res.sendFile(join(process.cwd(), 'uploads/avatars/' + image_name)));
  }

  @UseGuards(SuperUserGuard)
  @Put('change_status')
  @HttpCode(HttpStatus.OK)
  changeStatus(@Body() body: ChangeEmployeeStatusDto) {
    return this.employeeService.changeEmployeeStatus(body);
  }

  @UseGuards(SuperUserGuard)
  @Post('employee_avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar_file', multerAvatarOptions))
  employeeAvatar(
    @Req() req: any,
    @Query() query: EmployeeAvatarDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file != null) {
      return this.employeeService.saveEmployeeAvatar(query, file);
    }
    throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
  }

  @UseGuards(SuperUserGuard)
  @Post('archive_file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('archived_file', multerArchiveOptions))
  archiveFile(
    @Req() req: any,
    @Query() query: EmployeeArchiveFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file != null) {
      return this.employeeService.saveEmployeeArchiveFile(query, file);
    }
    throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
  }

  @UseGuards(SuperUserGuard)
  @Put('archive_on')
  @HttpCode(HttpStatus.OK)
  archiveOn(@Req() req: any, @Body() body: EmployeeArchiveDto) {
    const user = <UserEntity>req.user;
    return this.employeeService.archiveOn(user, body);
  }

  @UseGuards(SuperUserGuard)
  @Put('archive_off')
  @HttpCode(HttpStatus.OK)
  archiveOff(@Body() body: EmployeeArchiveDto) {
    return this.employeeService.archiveOff(body);
  }

  @UseGuards(SuperUserGuard)
  @Get('get_archived_employees')
  @HttpCode(HttpStatus.OK)
  getArchivedEmployees(@Query() params: GetArchivedEmployeesDto) {
    return this.employeeService.getArchiveEmployees(params);
  }

  @UseGuards(SuperUserGuard)
  @Get('get_archived_employee')
  @HttpCode(HttpStatus.OK)
  getArchivedEmployee(@Query() query: GetEmployeeByNoDto) {
    return this.employeeService.getArchivedEmployeeByNo(query);
  }
}
