import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { useCategoriesStore } from '../../../stores/CategoriesStore';

interface Category {
  id: number;
  name: string;
  description?: string;
}

const CategoriesTable: React.FC = () => {
  const { categories, fetchCategories, removeCategory, addCategory, updateCategory } = useCategoriesStore();
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<{ open: boolean, id: number | null }>({ open: false, id: null });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = (id: number) => {
    setIsConfirmingDelete({ open: true, id });
  };

  const handleConfirmDelete = () => {
    if (isConfirmingDelete.id !== null) {
      removeCategory(isConfirmingDelete.id);
    }
    setIsConfirmingDelete({ open: false, id: null });
  };

  const handleSaveCategory = (category: Category) => {
    if (category.id) {
      updateCategory(category.id, category);
    } else {
      addCategory(category);
    }
    setEditingCategory(null);
    setIsCreating(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const actionBodyTemplate = (rowData: Category) => {
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => handleEdit(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData.id)} />
      </>
    );
  };

  const header = (
    <div className="table-header flex justify-content-between">
      <h5 className="m-0">Manage Categories</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search Category..."
        />
      </span>
      <Button label="New Category" icon="pi pi-plus" onClick={() => setIsCreating(true)} />
    </div>
  );

  return (
    <>
      <div className="card">
        <DataTable
          value={categories}
          paginator
          rows={10}
          header={header}
          globalFilterFields={['name', 'description']}
          globalFilter={globalFilter}
          emptyMessage="No categories found."
          className="datatable-responsive"
          dataKey="id"
          responsiveLayout="scroll"
        >
          <Column field="id" header="ID" sortable></Column>
          <Column field="name" header="Name" sortable filter></Column>
          <Column field="description" header="Description" sortable filter></Column>
          <Column body={actionBodyTemplate} header="Actions"></Column>
        </DataTable>
      </div>

      {/* Modal de edición/creación de categoría */}
      <Dialog visible={editingCategory !== null || isCreating} onHide={() => setEditingCategory(null)} header="Category Form">
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText id="name" value={editingCategory?.name || ''} onChange={(e) => setEditingCategory({ ...editingCategory!, name: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="description">Description</label>
            <InputText id="description" value={editingCategory?.description || ''} onChange={(e) => setEditingCategory({ ...editingCategory!, description: e.target.value })} />
          </div>
        </div>
        <Button label="Save" icon="pi pi-check" onClick={() => handleSaveCategory(editingCategory!)} />
        <Button label="Cancel" icon="pi pi-times" className="p-button-secondary" onClick={() => setEditingCategory(null)} />
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog visible={isConfirmingDelete.open} onHide={() => setIsConfirmingDelete({ open: false, id: null })}>
        <div>Are you sure you want to delete this category?</div>
        <Button label="Yes" icon="pi pi-check" onClick={handleConfirmDelete} />
        <Button label="No" icon="pi pi-times" className="p-button-secondary" onClick={() => setIsConfirmingDelete({ open: false, id: null })} />
      </Dialog>
    </>
  );
};

export default CategoriesTable;
