import create from 'zustand';
import apiClient from 'config/AxiosConfig';

interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: number, updatedData: Partial<Category>) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/categories');
      set({ categories: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching categories', loading: false });
      console.error('Error fetching categories:', error);
    }
  },

  addCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await apiClient.post('/categories', category);
      set((state) => ({
        categories: [...state.categories, response.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error adding category', loading: false });
      console.error('Error adding category:', error);
    }
  },

  updateCategory: async (id, updatedData) => {
    set({ loading: true });
    try {
      const response = await apiClient.patch(`/categories/${id}`, updatedData);
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? response.data : category
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error updating category', loading: false });
      console.error('Error updating category:', error);
    }
  },

  removeCategory: async (id) => {
    set({ loading: true });
    try {
      await apiClient.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error removing category', loading: false });
      console.error('Error removing category:', error);
    }
  },
}));
