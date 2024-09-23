import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log('Connected to the database');
  }

  // Método para obtener todos los productos, incluyendo las cantidades de disponibles y alquilados
  async getProductsByStatusAndQuantity() {
    const allProducts = await this.products.findMany({
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    // Recorremos cada producto y calculamos las cantidades alquiladas y disponibles
    const productStatusDetails = await Promise.all(
      allProducts.map(async (product) => {
        // Cantidad de productos alquilados
        const rentedCount = await this.rentals.count({
          where: {
            products: {
              some: {
                productId: product.id,
              },
            },
            status: 'active',  // Solo contamos los productos actualmente alquilados
          },
        });

        // La cantidad disponible es la cantidad total menos la cantidad alquilada
        const availableCount = product.quantity - rentedCount;

        // Devolvemos un objeto con los detalles del producto
        return {
          id: product.id,
          inventoryCode: product.inventoryCode,
          name: product.name,
          category: product.category.name,
          type: product.type,
          gender: product.gender,
          description: product.description,
          quantity: product.quantity,
          availableCount: availableCount >= 0 ? availableCount : 0,  // Aseguramos que availableCount nunca sea negativo
          rentedCount,     // Cantidad alquilada
          size: product.size,
          condition: product.condition,
          area: product.area,
          box: product.box,
          status: product.status,
          acquisitionDate: product.acquisitionDate,
        };
      })
    );

    // Devolvemos todos los productos con los detalles de estado
    return {
      totalProducts: allProducts.length,
      productDetails: productStatusDetails,
    };
  }

  // Obtener el estado de alquiler de un producto específico
  async getProductRentalStatusById(productId: number) {
    const product = await this.products.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Contamos cuántos productos están alquilados
    const rentedCount = await this.rentals.count({
      where: {
        products: {
          some: {
            productId: productId,
          },
        },
        status: 'active',
      },
    });

    // La cantidad disponible es la cantidad total menos la cantidad alquilada
    const availableCount = product.quantity - rentedCount;

    return {
      productName: product.name,
      category: product.category.name,
      totalQuantity: product.quantity,
      rentedCount,
      availableCount,
    };
  }

  // Crear un nuevo producto
  async create(createProductDto: CreateProductDto) {
    const category = await this.categories.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new Error(`Category with ID ${createProductDto.categoryId} not found`);
    }

    const inventoryCode = this.generateInventoryCode(category.name);

    return this.products.create({
      data: {
        inventoryCode,
        name: createProductDto.name,
        categoryId: createProductDto.categoryId,
        type: createProductDto.type,
        gender: createProductDto.gender,
        description: createProductDto.description,
        quantity: createProductDto.quantity,
        size: createProductDto.size,
        condition: createProductDto.condition,
        area: createProductDto.area,
        box: createProductDto.box,
        status: createProductDto.status,
        acquisitionDate: createProductDto.acquisitionDate,
      },
    });
  }

  // Obtener todos los productos
  async findAll() {
    return this.products.findMany({
      include: {
        category: {
          select: { name: true },
        },
      },
    });
  }

  // Obtener un producto por su ID
  async findOne(id: number) {
    return this.products.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true },
        },
      },
    });
  }

  // Actualizar un producto
  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.products.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        categoryId: updateProductDto.categoryId,
        type: updateProductDto.type,
        gender: updateProductDto.gender,
        description: updateProductDto.description,
        quantity: updateProductDto.quantity,
        size: updateProductDto.size,
        condition: updateProductDto.condition,
        area: updateProductDto.area,
        box: updateProductDto.box,
        status: updateProductDto.status,
        acquisitionDate: updateProductDto.acquisitionDate,
        // Eliminamos availableCount ya que se calcula dinámicamente
      },
      include: {
        category: {
          select: { name: true },
        },
      },
    });
  }

  // Eliminar un producto
  async remove(id: number) {
    return this.products.delete({
      where: { id },
    });
  }

  

  // Generar código de inventario basado en el nombre de la categoría
  private generateInventoryCode(categoryName: string): string {
    const prefix = categoryName.slice(0, 3).toUpperCase();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNumber}`;
  }
}
