import create from 'zustand';
import axios from 'axios';
import { useCategoriesStore } from './CategoriesStore'; // Importamos el store de categorías

interface Product {
  id: number;
  inventoryCode: string;
  name: string;
  categoryId: number;  // Usamos categoryId para relacionar con categorías
  type: string;
  gender: string;
  description?: string;
  quantity: number;
  size?: string;
  condition?: string;
  area?: string;
  box?: string;
  status: string;
  acquisitionDate: string;
  availableCount: number;
  rentedCount: number;
}

interface ProductCreateDto extends Omit<Product, 'id' | 'inventoryCode' | 'availableCount' | 'rentedCount'> {}

interface ProductStore {
  products: Product[];
  productDetails: Product | null;
  loading: boolean;
  error: string | null;
  productsByCategoryCount: Record<string, number>;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchProductStatus: () => Promise<void>;
  fetchProductsCountByCategory: () => Promise<void>;
  createProduct: (product: ProductCreateDto) => Promise<void>;
  updateProduct: (id: number, product: ProductCreateDto) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  productDetails: null,
  loading: false,
  error: null,
  productsByCategoryCount: {}, // Almacenamos el conteo de productos por categoría

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('http://localhost:3001/products');
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching products', loading: false });
    }
  },

  fetchProductById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:3001/products/${id}`);
      set({ productDetails: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching product details', loading: false });
    }
  },

  fetchProductStatus: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('http://localhost:3001/products/status-details');
      set({ products: response.data.productDetails, loading: false });
    } catch (error) {
      set({ error: 'Error fetching product status', loading: false });
    }
  },

  // Nuevo método para obtener el conteo de productos por categoría
  fetchProductsCountByCategory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('http://localhost:3001/products/count-by-category');
      set({ productsByCategoryCount: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching products count by category', loading: false });
    }
  },

  createProduct: async (product: ProductCreateDto) => {
    set({ loading: true, error: null });
    try {
      // Aseguramos que quantity sea un número
      const productToSend = { 
        ...product, 
        quantity: Number(product.quantity) 
      };
      
      console.log('Datos enviados al backend:', productToSend);  // Log para verificar los datos corregidos
      await axios.post('http://localhost:3001/products', productToSend);
      await useProductStore.getState().fetchProducts();
    } catch (error: any) {
      console.error('Detalles del error:', error.response?.data || error.message);
      set({ error: 'Error creating product', loading: false });
    }
  },
  
  

  updateProduct: async (id: number, product: ProductCreateDto) => {
    set({ loading: true, error: null });
    try {
      await axios.patch(`http://localhost:3001/products/${id}`, product);
      await useProductStore.getState().fetchProducts();
    } catch (error) {
      set({ error: 'Error updating product', loading: false });
    }
  },

  deleteProduct: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`http://localhost:3001/products/${id}`);
      await useProductStore.getState().fetchProducts();
    } catch (error) {
      set({ error: 'Error deleting product', loading: false });
    }
  },
}));

export default useProductStore;
