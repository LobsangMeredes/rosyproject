import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { RentalsModule } from './rentals/rentals.module';
import { ClientsModule } from './clients/clients.module';

import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [ CategoriesModule, ProductsModule, RentalsModule, ClientsModule, InvoicesModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
