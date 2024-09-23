import { IsDateString, IsEnum, IsInt, IsArray } from 'class-validator';
import { RentalStatus } from '@prisma/client';

export class CreateRentalDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(RentalStatus)
  status: RentalStatus;  // Debe ser parte de la enumeración

  @IsArray()
  @IsInt({ each: true })
  productIds: number[];  // Lista de IDs de productos a alquilar

  @IsInt()
  clientId: number;  // Relacionar con el cliente
}
