import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoriesService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log('Connected to the database');
  }

  // Método para crear una categoría
  create(createCategoryDto: CreateCategoryDto) {
    return this.categories.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
      },
    });
  }

  // Método para obtener todas las categorías
  findAll() {
    return this.categories.findMany();
  }

  // Método para obtener una categoría por ID
  findOne(id: number) {
    return this.categories.findUnique({
      where: { id },
    });
  }

  // Método para actualizar una categoría
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const {id: _, ...data} = updateCategoryDto;

    try {
      const updatedCategory = await this.categories.update({
        where: { id },
        data: data,
      });
      return updatedCategory;
    } catch (error) {
      console.error('Error actualizando la categoría:', error);
      throw new Error('No se pudo actualizar la categoría');
    }
  }
  
  
  

  // Método para eliminar una categoría por ID
  remove(id: number) {
    return this.categories.delete({
      where: { id },
    });
  }
}
