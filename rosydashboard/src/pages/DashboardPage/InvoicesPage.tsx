// src/pages/CategoriesPage.tsx
import React from 'react';
import InvoiceDetailsPage from 'components/dashboard/dashboardContent/InvoicesContent';


const InvoicePage: React.FC = () => {
  return (
    <div>
      <h2>Create product </h2>
        <InvoiceDetailsPage />
    </div>
  );
};

export default InvoicePage;
