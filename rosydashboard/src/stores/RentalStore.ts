import create from 'zustand';
import apiClient from 'config/AxiosConfig'; // Usamos el cliente Axios centralizado

interface Product {
  id: number;
  name: string;
}

interface Rental {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  clientId: number;
  products: Product[];
  client: { id: number; name: string };
}

interface CreateRentalDto {
  startDate: string;
  endDate: string;
  productIds: number[];
  clientId: number;
  status: string;
}

interface RentalStore {
  rentals: Rental[];
  activeRentals: Rental[];
  historicalRentals: Rental[];
  rentalProducts: Product[]; // Los productos asociados a una renta específica
  loading: boolean;
  error: string | null;
  fetchRentals: () => Promise<void>;
  getRentalProducts: (rentalId: number) => Promise<void>;
  completeRental: (id: number) => Promise<void>;
  updateRental: (id: number, data: Partial<Rental>) => Promise<void>;
  createRental: (data: CreateRentalDto) => Promise<Rental>;
  deleteRental: (id: number) => Promise<void>;
}

const useRentalStore = create<RentalStore>((set) => ({
  rentals: [],
  activeRentals: [],
  historicalRentals: [],
  rentalProducts: [],
  loading: false,
  error: null,

  fetchRentals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/rentals'); // Usamos apiClient
      const rentals = response.data;

      const activeRentals = rentals.filter((rental: Rental) => rental.status !== 'completed');
      const historicalRentals = rentals.filter((rental: Rental) => rental.status === 'completed');

      set({ rentals, activeRentals, historicalRentals, loading: false });
    } catch (error: any) {
      set({ error: 'Error fetching rentals', loading: false });
    }
  },

  getRentalProducts: async (rentalId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/rentals/${rentalId}/products`); // Usamos apiClient
      set({ rentalProducts: response.data, loading: false });
    } catch (error: any) {
      set({ error: 'Error fetching rental products', loading: false });
    }
  },

  completeRental: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiClient.patch(`/rentals/${id}/complete`); // Usamos apiClient
      await useRentalStore.getState().fetchRentals();
      set({ loading: false });
    } catch (error: any) {
      set({ error: 'Error completing rental', loading: false });
    }
  },

  updateRental: async (id: number, data: Partial<Rental>) => {
    set({ loading: true, error: null });
    try {
      await apiClient.patch(`/rentals/${id}`, data); // Usamos apiClient
      await useRentalStore.getState().fetchRentals();
      set({ loading: false });
    } catch (error: any) {
      set({ error: 'Error updating rental', loading: false });
    }
  },

  createRental: async (data: CreateRentalDto) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/rentals', data); // Usamos apiClient
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({ error: 'Error creating rental', loading: false });
      throw error;
    }
  },

  deleteRental: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/rentals/${id}`); // Usamos apiClient
      await useRentalStore.getState().fetchRentals();
      set({ loading: false });
    } catch (error: any) {
      set({ error: 'Error deleting rental', loading: false });
    }
  },
}));

export default useRentalStore;
