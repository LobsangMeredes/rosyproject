import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, RentalStatus } from '@prisma/client';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log('Connected to the database');
  }

  // Crear una nueva renta
  async create(createRentalDto: CreateRentalDto) {
    const { productIds, startDate, endDate, status, clientId } = createRentalDto;

    const rental = await this.rentals.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        clientId,
        products: {
          create: productIds.map((productId) => ({
            product: { connect: { id: productId } },
          })),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    // Asegúrate de devolver la renta completa, incluyendo las relaciones
    return rental;
  }

  // Obtener todas las rentas
  async findAll() {
    return this.rentals.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
        client: true,
      },
    });
  }

  // Obtener una renta específica
  async findOne(id: number) {
    return this.rentals.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        client: true,
      },
    });
  }

  // Actualizar una renta
  async update(id: number, updateRentalDto: UpdateRentalDto) {
    const { startDate, endDate } = updateRentalDto;

    const updates: any = {};

    if (startDate) {
      updates.startDate = new Date(startDate);
      if (isNaN(updates.startDate.getTime())) {
        throw new Error('Fecha de inicio inválida');
      }
    }

    if (endDate) {
      updates.endDate = new Date(endDate);
      if (isNaN(updates.endDate.getTime())) {
        throw new Error('Fecha de fin inválida');
      }
    }

    return this.rentals.update({
      where: { id },
      data: {
        ...updates,
        status: updateRentalDto.status,
        clientId: updateRentalDto.clientId,
      },
    });
  }

  // Eliminar una renta
  async remove(id: number) {
    const rental = await this.rentals.findUnique({
      where: { id },
      include: { products: true },
    });

    if (rental) {
      const productIds = rental.products.map((p) => p.productId);

      await this.products.updateMany({
        where: {
          id: { in: productIds },
        },
        data: { status: 'disponible' },
      });

      return this.rentals.delete({
        where: { id },
      });
    }
  }

  // Completar un alquiler y archivarlo en el historial
  async completeRental(rentalId: number) {
    const rental = await this.rentals.findUnique({
      where: { id: rentalId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        client: true,
      },
    });

    if (!rental) {
      throw new Error(`Rental with ID ${rentalId} not found`);
    }

    await this.rentalHistory.create({
      data: {
        rentalId: rental.id,
        startDate: rental.startDate,
        endDate: rental.endDate,
        status: rental.status,
        clientId: rental.clientId,
        products: JSON.stringify(rental.products),
        archivedAt: new Date(),
      },
    });

    await this.rentals.update({
      where: { id: rentalId },
      data: {
        status: 'completed',
      },
    });

    for (const rentalProduct of rental.products) {
      await this.products.update({
        where: { id: rentalProduct.productId },
        data: {
          status: 'disponible',
        },
      });
    }

    return { message: `Rental with ID ${rentalId} completed and archived.` };
  }

  async getRentalProducts(rentalId: number) {
    const rentalWithProducts = await this.rentals.findUnique({
      where: { id: rentalId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!rentalWithProducts) {
      throw new Error(`Rental with ID ${rentalId} not found`);
    }

    return rentalWithProducts.products.map((rp) => rp.product); // Devuelve solo los productos
  }
}
