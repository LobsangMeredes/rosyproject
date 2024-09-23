import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService extends PrismaClient implements OnModuleInit {
  private readonly depositAmount = 500;  // Fixed deposit amount

  onModuleInit() {
    this.$connect();
    console.log('Connected to the database');
  }

  // Create a new invoice associated with a rental
  async create(createInvoiceDto: CreateInvoiceDto) {
    const { rentalId, clientId, total } = createInvoiceDto;

    // Verify if the rental exists
    const rental = await this.rentals.findUnique({
      where: { id: rentalId },
    });

    if (!rental) {
      throw new Error(`Rental with ID ${rentalId} not found`);
    }

    // Verify if the client exists
    const client = await this.clients.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    // Add deposit amount to the manually entered total
    const totalWithDeposit = total + this.depositAmount;

    // Create the invoice with the final total
    const invoice = await this.invoices.create({
      data: {
        rentalId: rentalId,
        clientId: clientId,
        total: totalWithDeposit,  // Total + 500 DOP deposit
        status: 'pending',
      },
    });

    return invoice;
  }

  // Fetch all invoices
  // Fetch all invoices with client and rental details
async findAll() {
  return this.invoices.findMany({
    include: {
      client: true,  // Incluir detalles del cliente
      rental: {
        include: {
          products: true,  // Incluir productos de la renta
        },
      },
    },
  });
}


  // Fetch an invoice by ID, including client and rental details
  async findOne(id: number) {
    return this.invoices.findUnique({
      where: { id },
      include: {
        client: true,  // Include client details
        rental: {
          include: {
            products: true,  // Include products in the rental
          },
        },
      },
    });
  }

  // Update an invoice by ID
  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoices.update({
      where: { id },
      data: updateInvoiceDto,
    });
  }

  // Delete an invoice by ID
  async remove(id: number) {
    return this.invoices.delete({
      where: { id },
    });
  }
}
