import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('status-details')
  @ApiOperation({ summary: 'Obtener resumen de productos alquilados y disponibles' })
  @ApiResponse({ status: 200, description: 'Resumen obtenido con éxito.' })
  getProductsByStatusAndQuantity() {
    return this.productsService.getProductsByStatusAndQuantity();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto con {name, categoryId, type, gender, quantity, etc.}' })
  @ApiResponse({ status: 201, description: 'Producto creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida con éxito.' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id/rental-status')
  @ApiOperation({ summary: 'Obtener el estado de alquiler de un producto' })
  @ApiResponse({ status: 200, description: 'Estado obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  getProductRentalStatusById(@Param('id') id: string) {
    return this.productsService.getProductRentalStatusById(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto específico por ID' })
  @ApiResponse({ status: 200, description: 'Producto obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto con {name, categoryId, etc.}' })
  @ApiResponse({ status: 200, description: 'Producto actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiBody({ type: UpdateProductDto })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  

  
}
