import React, { useState, useEffect, useRef } from 'react';
import useProductStore from '../../../stores/ProductsStore';
import { useCategoriesStore } from '../../../stores/CategoriesStore';
import { Product, Status, Gender, Condition, Size, Type } from './enums';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import './styles/CreateProduct.css';

const EditProduct: React.FC = () => {
  const { products, fetchProducts, updateProduct } = useProductStore(); // Para obtener productos y actualizarlos
  const { categories, fetchCategories } = useCategoriesStore();
  const toast = useRef<Toast>(null);

  // Estado inicial para seleccionar producto y para editar
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [product, setProduct] = useState<Omit<Product, 'id' | 'inventoryCode' | 'availableCount' | 'rentedCount'> | null>(null);

  useEffect(() => {
    fetchProducts(); // Obtener lista de productos al cargar el componente
    fetchCategories(); // Obtener categorías
  }, [fetchProducts, fetchCategories]);

  const handleProductSelect = (productId: number) => {
    const productToEdit = products.find((prod) => prod.id === productId);
    if (productToEdit) {
      setProduct(productToEdit); // Cargar producto seleccionado en el estado
      setSelectedProductId(productId);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProduct((prevProduct) => prevProduct && ({
      ...prevProduct,
      [id]: value,
    }));
  };

  const handleDropdownChange = (field: keyof Omit<Product, 'id' | 'inventoryCode' | 'availableCount' | 'rentedCount'>, value: any) => {
    setProduct((prevProduct) => prevProduct && ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (selectedProductId && product) {
      // Limpiar los datos antes de enviarlos
      const { category, inventoryCode, availableCount, rentedCount, id, ...cleanProduct } = product;
  
      try {
        // Actualiza el producto seleccionado
        await updateProduct(selectedProductId, cleanProduct);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product updated successfully!' });
      } catch (error) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update product.' });
      }
    }
  };

  return (
    <div className="edit-product-form">
      <Toast ref={toast} /> {/* Componente Toast para notificaciones */}

      <Card title="Edit Product" style={{ maxWidth: '600px', margin: '0 auto', padding: '2em' }}>
        {/* Select para elegir el producto a editar */}
        <div className="p-field">
          <label htmlFor="product-select">Select Product</label>
          <Dropdown
            id="product-select"
            value={selectedProductId}
            options={products.map((prod) => ({ label: prod.name, value: prod.id }))}
            onChange={(e) => handleProductSelect(e.value)}
            placeholder="Select a product to edit"
            className="p-inputtext-lg"
          />
        </div>

        {/* Mostrar el formulario solo si un producto ha sido seleccionado */}
        {product && (
          <div className="form-grid">
            <div className="p-field">
              <label htmlFor="name">Product Name</label>
              <InputText id="name" value={product.name} onChange={handleChange} placeholder="Enter product name" className="p-inputtext-lg" />
            </div>

            <div className="p-field">
              <label htmlFor="categoryId">Category</label>
              <Dropdown
                id="categoryId"
                value={product.categoryId}
                options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
                onChange={(e) => handleDropdownChange('categoryId', e.value)}
                placeholder="Select Category"
              />
            </div>

            <div className="p-field">
              <label htmlFor="type">Type</label>
              <Dropdown
                id="type"
                value={product.type}
                options={Object.values(Type).map((type) => ({ label: type, value: type }))}
                onChange={(e) => handleDropdownChange('type', e.value)}
                placeholder="Select Type"
              />
            </div>

            <div className="p-field">
              <label htmlFor="gender">Gender</label>
              <Dropdown
                id="gender"
                value={product.gender}
                options={Object.values(Gender).map((gender) => ({ label: gender, value: gender }))}
                onChange={(e) => handleDropdownChange('gender', e.value)}
                placeholder="Select Gender"
              />
            </div>

            <div className="p-field">
              <label htmlFor="size">Size</label>
              <Dropdown
                id="size"
                value={product.size}
                options={Object.values(Size).map((size) => ({ label: size, value: size }))}
                onChange={(e) => handleDropdownChange('size', e.value)}
                placeholder="Select Size"
              />
            </div>

            <div className="p-field">
              <label htmlFor="condition">Condition</label>
              <Dropdown
                id="condition"
                value={product.condition}
                options={Object.values(Condition).map((condition) => ({ label: condition, value: condition }))}
                onChange={(e) => handleDropdownChange('condition', e.value)}
                placeholder="Select Condition"
              />
            </div>

            <div className="p-field">
              <label htmlFor="quantity">Quantity</label>
              <InputText id="quantity" type="number" value={product.quantity.toString()} onChange={handleChange} placeholder="Enter quantity" />
            </div>

            <div className="p-field">
              <label htmlFor="status">Status</label>
              <Dropdown
                id="status"
                value={product.status}
                options={Object.values(Status).map((status) => ({ label: status, value: status }))} 
                onChange={(e) => handleDropdownChange('status', e.value)}
                placeholder="Select Status"
              />
            </div>

            <div className="p-field">
              <label htmlFor="area">Area</label>
              <InputText id="area" value={product.area} onChange={handleChange} placeholder="Enter area" />
            </div>

            <div className="p-field">
              <label htmlFor="box">Box</label>
              <InputText id="box" value={product.box} onChange={handleChange} placeholder="Enter box" />
            </div>

            <Button label="Update Product" onClick={handleSubmit} className="p-button-success p-mt-2" />
          </div>
        )}
      </Card>
    </div>
  );
};

export default EditProduct;
