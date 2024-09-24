import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import useProductStore from '../../../stores/ProductsStore';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Product {
  id: number;
  inventoryCode: string;
  name: string;
  category: string; // category is a string, not an object
  type: string;
  gender: string;
  quantity: number;
  availableCount: number;
  rentedCount: number;
  size?: string;
  condition?: string;
  area?: string;
  box?: string;
  status: string;
  acquisitionDate: string;
}

const ProductsTable: React.FC = () => {
  const { products, fetchProductStatus, deleteProduct } = useProductStore();
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<{ open: boolean, id: number | null }>({ open: false, id: null });

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchProductStatus();  // Fetch product details and their availability status
  }, [fetchProductStatus]);

  // Dummy data for categories and statuses (replace with real API data)
  const categories = ['Punk', 'Casual', 'Formal', 'Sport'];
  const types = ['ropa', 'calzado', 'accesorio'];
  const statuses = ['disponible', 'alquilado'];

  const handleDelete = (id: number) => {
    setIsConfirmingDelete({ open: true, id });
  };

  const handleConfirmDelete = () => {
    if (isConfirmingDelete.id !== null) {
      deleteProduct(isConfirmingDelete.id);
    }
    setIsConfirmingDelete({ open: false, id: null });
  };

  const header = (
    <div className="table-header flex justify-content-between align-items-center">
      <h5 className="m-0">Product List</h5>
      <div className="flex">
        <span className="p-input-icon-left p-mr-3">
          <i className="pi pi-search" style={{ paddingRight: '8px' }} />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search by Name"
            className="p-inputtext-lg"
            style={{ width: '300px' }} // Larger search bar
          />
        </span>

        {/* Dropdown filters */}
        <Dropdown
          value={selectedCategory}
          options={categories.map((category) => ({ label: category, value: category }))}
          onChange={(e) => setSelectedCategory(e.value)}
          placeholder="Filter by Category"
          className="p-mr-2"
        />
        <Dropdown
          value={selectedType}
          options={types.map((type) => ({ label: type, value: type }))}
          onChange={(e) => setSelectedType(e.value)}
          placeholder="Filter by Type"
          className="p-mr-2"
        />
        <Dropdown
          value={selectedStatus}
          options={statuses.map((status) => ({ label: status, value: status }))}
          onChange={(e) => setSelectedStatus(e.value)}
          placeholder="Filter by Status"
          className="p-mr-2"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="card">
        <DataTable
          value={products}
          paginator
          rows={10}
          header={header}
          globalFilterFields={['name', 'category', 'status', 'type', 'inventoryCode']} // Adjusted 'category.name' to 'category'
          globalFilter={globalFilter}
          emptyMessage="No products found."
          className="datatable-responsive"
          dataKey="id"
          responsiveLayout="scroll"
        >
          {/* Columns for each product attribute */}
          <Column field="id" header="ID" sortable></Column>
          <Column field="inventoryCode" header="Inventory Code" sortable></Column>
          <Column field="name" header="Name" sortable filter></Column>
          <Column
            field="category"
            header="Category"
            sortable
            body={(rowData: Product) => rowData.category}  // Corrected here
          />
          <Column field="type" header="Type" sortable filter></Column>
          <Column field="gender" header="Gender" sortable filter></Column>
          <Column field="quantity" header="Total Quantity" sortable filter></Column>
          <Column field="availableCount" header="Available Quantity" sortable filter></Column>
          <Column field="rentedCount" header="Rented Quantity" sortable filter></Column>
          <Column field="size" header="Size" sortable filter></Column>
          <Column field="condition" header="Condition" sortable filter></Column>
          <Column field="area" header="Area" sortable filter></Column>
          <Column field="box" header="Box" sortable filter></Column>
          <Column field="status" header="Status" sortable filter></Column>
          <Column field="acquisitionDate" header="Acquisition Date" sortable filter></Column>
          <Column
            body={(rowData: Product) => (
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData.id)} />
            )}
            header="Actions"
          ></Column>
        </DataTable>
      </div>

      {/* Modal for confirming deletion */}
      <Dialog visible={isConfirmingDelete.open} onHide={() => setIsConfirmingDelete({ open: false, id: null })}>
        <div>Are you sure you want to delete this product?</div>
        <Button label="Yes" icon="pi pi-check" onClick={handleConfirmDelete} />
        <Button label="No" icon="pi pi-times" className="p-button-secondary" onClick={() => setIsConfirmingDelete({ open: false, id: null })} />
      </Dialog>
    </>
  );
};

export default ProductsTable;
