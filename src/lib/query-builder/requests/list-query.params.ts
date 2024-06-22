import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { toNumber } from 'lodash';

export class ListQueryParams {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @IsNumber()
  @Transform((value) => toNumber(value))
  paginate = 15;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @Transform((value) => toNumber(value))
  page?: number;

  @IsOptional()
  @IsString()
  sort = '-updatedAt';

  @IsOptional()
  include?: string;

  @IsOptional()
  includeCount?: string;

  @IsOptional()
  @Type(() => Object)
  filter?: Record<string, string>;
}
