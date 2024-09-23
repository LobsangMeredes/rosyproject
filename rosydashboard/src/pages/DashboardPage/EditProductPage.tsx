// src/pages/CategoriesPage.tsx
import React from 'react';
import EditProduct from '../../components/dashboard/dashboardContent/EditProduct';


const EditProductPage: React.FC = () => {
  return (
    <div>
      <h2>Create product </h2>
        <EditProduct />
    </div>
  );
};

export default EditProductPage;
