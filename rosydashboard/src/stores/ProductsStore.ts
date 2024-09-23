import create from 'zustand';
import apiClient from 'config/AxiosConfig'; // Usamos el cliente Axios centralizado

interface Product {
  id: number;
  inventoryCode: string;
  name: string;
  categoryId: number;  // Relacionado con categorías
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
  productsByCategoryCount: {},

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/products'); // Usamos apiClient
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching products', loading: false });
    }
  },

  fetchProductById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/products/${id}`); // Usamos apiClient
      set({ productDetails: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching product details', loading: false });
    }
  },

  fetchProductStatus: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/products/status-details'); // Usamos apiClient
      set({ products: response.data.productDetails, loading: false });
    } catch (error) {
      set({ error: 'Error fetching product status', loading: false });
    }
  },

  fetchProductsCountByCategory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/products/count-by-category'); // Usamos apiClient
      set({ productsByCategoryCount: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching products count by category', loading: false });
    }
  },

  createProduct: async (product: ProductCreateDto) => {
    set({ loading: true, error: null });
    try {
      const productToSend = { 
        ...product, 
        quantity: Number(product.quantity) 
      };
      console.log('Datos enviados al backend:', productToSend);
      await apiClient.post('/products', productToSend); // Usamos apiClient
      await useProductStore.getState().fetchProducts();
    } catch (error: any) {
      console.error('Detalles del error:', error.response?.data || error.message);
      set({ error: 'Error creating product', loading: false });
    }
  },

  updateProduct: async (id: number, product: ProductCreateDto) => {
    set({ loading: true, error: null });
    try {
      await apiClient.patch(`/products/${id}`, product); // Usamos apiClient
      await useProductStore.getState().fetchProducts();
    } catch (error) {
      set({ error: 'Error updating product', loading: false });
    }
  },

  deleteProduct: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/products/${id}`); // Usamos apiClient
      await useProductStore.getState().fetchProducts();
    } catch (error) {
      set({ error: 'Error deleting product', loading: false });
    }
  },
}));

export default useProductStore;
