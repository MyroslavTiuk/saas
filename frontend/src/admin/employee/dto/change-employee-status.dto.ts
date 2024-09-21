import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ChangeEmployeeStatusDto {
  @IsNotEmpty()
  @IsString()
  employee_no: string;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  status: boolean;
}
