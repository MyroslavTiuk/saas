import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetEmployeeByIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  employee_id: number;
}
