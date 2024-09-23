  import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
  import { InvoicesService } from './invoices.service';
  import { CreateInvoiceDto } from './dto/create-invoice.dto';
  import { UpdateInvoiceDto } from './dto/update-invoice.dto';
  import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

  @ApiTags('invoices')
  @Controller('invoices')
  export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva factura con {rentalId, clientId, total}' })
    @ApiResponse({ status: 201, description: 'Factura creada con éxito.' })
    @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
    @ApiBody({ type: CreateInvoiceDto })
    create(@Body() createInvoiceDto: CreateInvoiceDto) {
      return this.invoicesService.create(createInvoiceDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las facturas' })
    @ApiResponse({ status: 200, description: 'Lista de facturas obtenida con éxito.' })
    findAll() {
      return this.invoicesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una factura específica por ID' })
    @ApiResponse({ status: 200, description: 'Factura obtenida con éxito.' })
    @ApiResponse({ status: 400, description: 'El ID de la factura debe ser un número válido.' })
    @ApiResponse({ status: 404, description: 'Factura no encontrada.' })
    async findOne(@Param('id') id: string) {
      const invoiceId = parseInt(id, 10);  // Convertir a número

      if (isNaN(invoiceId)) {
        throw new BadRequestException('El ID de la factura debe ser un número válido.');
      }

      const invoice = await this.invoicesService.findOne(invoiceId);
      if (!invoice) {
        throw new NotFoundException('Factura no encontrada.');
      }

      return invoice;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una factura con {status}' })
    @ApiResponse({ status: 200, description: 'Factura actualizada con éxito.' })
    @ApiResponse({ status: 404, description: 'Factura no encontrada.' })
    @ApiBody({ type: UpdateInvoiceDto })
    async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
      const invoiceId = parseInt(id, 10);
      
      if (isNaN(invoiceId)) {
        throw new BadRequestException('El ID de la factura debe ser un número válido.');
      }

      const invoice = await this.invoicesService.findOne(invoiceId);
      if (!invoice) {
        throw new NotFoundException('Factura no encontrada.');
      }

      return this.invoicesService.update(invoiceId, updateInvoiceDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una factura por ID' })
    @ApiResponse({ status: 200, description: 'Factura eliminada con éxito.' })
    @ApiResponse({ status: 404, description: 'Factura no encontrada.' })
    async remove(@Param('id') id: string) {
      const invoiceId = parseInt(id, 10);

      if (isNaN(invoiceId)) {
        throw new BadRequestException('El ID de la factura debe ser un número válido.');
      }

      const invoice = await this.invoicesService.findOne(invoiceId);
      if (!invoice) {
        throw new NotFoundException('Factura no encontrada.');
      }

      return this.invoicesService.remove(invoiceId);
    }
  }
