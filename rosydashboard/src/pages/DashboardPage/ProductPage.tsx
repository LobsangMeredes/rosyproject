// src/pages/CategoriesPage.tsx
import React from 'react';
import ProductsTable from '../../components/dashboard/dashboardContent/ProductContent';
const ProductPage: React.FC = () => {
  return (
    <div>
      <h2>Product Content</h2>
        <ProductsTable />
    </div>
  );
};

export default ProductPage;
