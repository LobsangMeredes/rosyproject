// src/pages/CategoriesPage.tsx
import React from 'react';
import CategoriesTable from '../../components/dashboard/dashboardContent/CategoriesContent';
const CategoriesPage: React.FC = () => {
  return (
    <div>
      <h2>Categorías</h2>
      <CategoriesTable />
    </div>
  );
};

export default CategoriesPage;
