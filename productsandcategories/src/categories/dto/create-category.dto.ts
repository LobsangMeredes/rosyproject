import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}
