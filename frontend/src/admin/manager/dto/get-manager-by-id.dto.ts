import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetManagerByIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  manager_id: number;
}
