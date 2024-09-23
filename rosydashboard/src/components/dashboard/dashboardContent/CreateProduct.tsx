import React, { useState, useEffect } from 'react';
import useProductStore from '../../../stores/ProductsStore';
import { useCategoriesStore } from '../../../stores/CategoriesStore';
import { Product, Status, Gender, Condition, Size, Type } from './enums';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import './styles/CreateProduct.css';

const CreateProduct: React.FC = () => {
  const { createProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoriesStore();

  // Estado inicial del producto
  const [product, setProduct] = useState<Omit<Product, 'id' | 'inventoryCode' | 'availableCount' | 'rentedCount'>>({
    name: '',
    categoryId: 0, // Usamos categoryId en lugar de category
    type: Type.ropa,
    gender: Gender.unisex,
    description: '',
    quantity: 0,
    size: Size.unico,
    condition: Condition.nuevo,
    area: '',
    box: '',
    status: Status.disponible,
    acquisitionDate: new Date().toISOString(),
  });

  useEffect(() => {
    fetchCategories(); // Obtener categorías al cargar el componente
  }, [fetchCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [id]: value,
    }));
  };

  const handleDropdownChange = (field: keyof Omit<Product, 'id' | 'inventoryCode' | 'availableCount' | 'rentedCount'>, value: any) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (product.categoryId === 0) {
      alert("Please select a category.");
      return;
    }

    // Crear el producto sin inventoryCode ya que lo genera el backend
    await createProduct(product);
    alert("Product created successfully!");
  };

  return (
    <div className="create-product-form">
      <h2>Create New Product</h2>

      <div className="form-grid">
        <div className="p-field">
          <label htmlFor="name">Product Name</label>
          <InputText id="name" value={product.name} onChange={handleChange} placeholder="Enter product name" />
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
      </div>

      <Button label="Save Product" onClick={handleSubmit} className="save-button" />
    </div>
  );
};

export default CreateProduct;
