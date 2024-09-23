// src/pages/CategoriesPage.tsx
import React from 'react';
import CreateProduct from '../../components/dashboard/dashboardContent/CreateProduct';


const CreateProductPage: React.FC = () => {
  return (
    <div>
      <h2>Create product </h2>
        <CreateProduct />
    </div>
  );
};

export default CreateProductPage;
