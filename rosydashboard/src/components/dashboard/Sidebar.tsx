import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelMenu } from 'primereact/panelmenu';
import 'primereact/resources/themes/saga-blue/theme.css';  // Puedes cambiar el tema si lo deseas
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';  // Opcional

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  // Define the menu structure
  const menuItems = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => {
        navigate('/');
      },
    },
    {
      label: 'Inventario',
      icon: 'pi pi-folder',
      items: [
        {
          label: 'Categorías',
          icon: 'pi pi-tags',
          command: () => {
            navigate('/categories');
          },
        },
        {
          label: 'Productos',
          icon: 'pi pi-box',
          items: [
            {
              label: 'Ver Productos',
              icon: 'pi pi-eye',
              command: () => {
                navigate('/products');
              },
            },
            {
              label: 'Crear Producto',
              icon: 'pi pi-plus',
              command: () => {
                navigate('/products/create');
              },
            },
            {
              label: 'Editar Producto',
              icon: 'pi pi-pencil',
              command: () => {
                navigate('/products/edit');
              },
            },
          ],
        },
        {
          label: 'Renta',
          icon: 'pi pi-calendar',
          items: [
            {
              label: 'Rentas Activas',
              icon: 'pi pi-clock',
              command: () => {
                navigate('/rentals');
              },
            },
            {
              label: 'Histórico de Rentas',
              icon: 'pi pi-book',
              command: () => {
                navigate('/rentals/history');
              },
            },
          ],
        },
      ],
    },
    {
      label: 'Facturación',
      icon: 'pi pi-money-bill',
      items: [
        {
          label: 'Clientes',
          icon: 'pi pi-users',
          command: () => {
            navigate('/clients');
          },
        },
        {
          label: 'Facturas Pendientes',
          icon: 'pi pi-file',
          command: () => {
            navigate('/invoices');
          },
        },
      ],
    },
  ];

  return (
    <div className="p-d-flex p-flex-column" style={{ width: '240px', marginTop: '64px' }}>
      <PanelMenu model={menuItems} style={{ width: '100%' }} />
    </div>
  );
};

export default Sidebar;
