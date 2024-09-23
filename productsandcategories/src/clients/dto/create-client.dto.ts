import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;


  @IsOptional()
  @IsEmail()
  email?: string;

  
  @IsString()
  phone: string;
}
