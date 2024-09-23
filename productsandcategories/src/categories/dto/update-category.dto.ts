import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {

    @IsNumber()
    @IsPositive()

    id : number;
}
