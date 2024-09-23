// src/App.tsx
import React from 'react';
import MainContent from './components/dashboard/MainContent';
import DashboardLayout from './pages/DashboardLayout';
import { Route, Routes } from 'react-router-dom';
import CategoriesPage from './pages/DashboardPage/CategoriesPage';
import ProductPage from './pages/DashboardPage/ProductPage';
import CreateProductPage from './pages/DashboardPage/CreateProduct';
import EditProductPage from './pages/DashboardPage/EditProductPage';
import RentalPage from 'pages/DashboardPage/RentalPage';
import ClientPage from 'pages/DashboardPage/ClientPage';
import InvoicePage from 'pages/DashboardPage/InvoicesPage';




function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/products/edit" element={<EditProductPage />} />
        <Route path="/rentals" element={<RentalPage />} />
        <Route path="/clients" element={<ClientPage />} />
        <Route path="/invoices" element={<InvoicePage />} />

        
      </Routes>
    </DashboardLayout>
  );
}

export default App;
