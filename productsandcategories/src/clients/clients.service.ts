    import { Injectable, OnModuleInit } from '@nestjs/common';
    import { PrismaClient } from '@prisma/client';
    import { CreateClientDto } from './dto/create-client.dto';
    import { UpdateClientDto } from './dto/update-client.dto';

    @Injectable()
    export class ClientsService extends PrismaClient implements OnModuleInit {
      async onModuleInit() {
        await this.$connect();  // Conectar a la base de datos cuando el módulo se inicialice
        console.log('Connected to the database');
      }

      // Método para crear un nuevo cliente
      async create(createClientDto: CreateClientDto) {
        try {
          const client = await this.clients.create({
            data: {
              name: createClientDto.name,
              email: createClientDto.email,
              phone: createClientDto.phone,
            },
          });
          return client;
        } catch (error) {
          console.error('Error creating client:', error);
          throw new Error('No se pudo crear el cliente');
        }
      }

      // Método para obtener todos los clientes
      async findAll() {
        try {
          return await this.clients.findMany();
        } catch (error) {
          console.error('Error fetching clients:', error);
          throw new Error('No se pudo obtener la lista de clientes');
        }
      }

      // Método para obtener un cliente por ID
      async findOne(id: number) {
        try {
          const client = await this.clients.findUnique({
            where: { id },
          });

          if (!client) {
            throw new Error(`Cliente con ID ${id} no encontrado`);
          }

          return client;
        } catch (error) {
          console.error('Error fetching client by ID:', error);
          throw new Error('No se pudo obtener el cliente');
        }
      }

      // Método para actualizar un cliente por ID
      async update(id: number, updateClientDto: UpdateClientDto) {
        try {
          const client = await this.clients.update({
            where: { id },
            data: {
              name: updateClientDto.name,
              email: updateClientDto.email,
              phone: updateClientDto.phone,
            },
          });
          return client;
        } catch (error) {
          console.error('Error updating client:', error);
          throw new Error(`No se pudo actualizar el cliente con ID ${id}`);
        }
      }

      // Método para eliminar un cliente por ID
      async remove(id: number) {
        try {
          const client = await this.clients.delete({
            where: { id },
          });
          return client;
        } catch (error) {
          console.error('Error deleting client:', error);
          throw new Error(`No se pudo eliminar el cliente con ID ${id}`);
        }
      }
    }
