import { IsInt, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsInt()
  rentalId: number;  // ID de la renta asociada

  @IsInt()
  clientId: number;  // ID del cliente asociado

  @IsNumber()
  total: number;  // Total de la factura ingresado manualmente (sin incluir la garantía)
}
