import { IsOptional } from 'class-validator';

export class ItemQueryParams {
  @IsOptional()
  include?: string;

  @IsOptional()
  includeCount?: string;
}
