import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('rentals')
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo alquiler con {startDate, endDate, productIds, clientId}' })
  @ApiResponse({ status: 201, description: 'Alquiler creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiBody({ type: CreateRentalDto })
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalsService.create(createRentalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los alquileres' })
  @ApiResponse({ status: 200, description: 'Lista de alquileres obtenida con éxito.' })
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un alquiler específico por ID' })
  @ApiResponse({ status: 200, description: 'Alquiler obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Alquiler no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.rentalsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un alquiler con {startDate, endDate, status}' })
  @ApiResponse({ status: 200, description: 'Alquiler actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Alquiler no encontrado.' })
  @ApiBody({ type: UpdateRentalDto })
  update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto) {
    return this.rentalsService.update(+id, updateRentalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un alquiler por ID' })
  @ApiResponse({ status: 200, description: 'Alquiler eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Alquiler no encontrado.' })
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(+id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Completar un alquiler' })
  @ApiResponse({ status: 200, description: 'Alquiler completado con éxito.' })
  @ApiResponse({ status: 404, description: 'Alquiler no encontrado.' })
  async completeRental(@Param('id') id: string) {
    const result = await this.rentalsService.completeRental(+id);
    return { message: 'Alquiler completado', result };
  }

    // Endpoint para obtener los productos de una renta
    @Get(':id/products')
    async getRentalProducts(@Param('id') id: string) {
      const rentalId = parseInt(id, 10);
      return this.rentalsService.getRentalProducts(rentalId);
    }
  
}
