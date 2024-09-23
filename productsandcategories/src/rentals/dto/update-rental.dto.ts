import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { RentalStatus } from '@prisma/client';

export class UpdateRentalDto {
  @IsOptional() // El campo `startDate` es opcional
  @IsDateString()
  startDate?: string;

  @IsOptional() // El campo `endDate` es opcional
  @IsDateString()
  endDate?: string;

  @IsOptional() // El campo `status` es opcional
  @IsEnum(RentalStatus)
  status?: RentalStatus;

  @IsOptional() // El campo `clientId` es opcional
  @IsInt()
  clientId?: number;
}
