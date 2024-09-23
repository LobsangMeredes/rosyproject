import create from 'zustand';
import axios from 'axios';

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
  getRentalProducts: (rentalId: number) => Promise<void>; // Método para obtener productos
  completeRental: (id: number) => Promise<void>;
  updateRental: (id: number, data: Partial<Rental>) => Promise<void>;
  createRental: (data: CreateRentalDto) => Promise<Rental>; // Retornamos el objeto Rental
  deleteRental: (id: number) => Promise<void>;
}

const useRentalStore = create<RentalStore>((set) => ({
  rentals: [],
  activeRentals: [],
  historicalRentals: [],
  rentalProducts: [], // Inicialmente vacío
  loading: false,
  error: null,

  // Obtener todas las rentas y clasificarlas en activas e históricas
  fetchRentals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('http://localhost:3001/rentals');
      const rentals = response.data;

      // Filtrar rentas activas e históricas
      const activeRentals = rentals.filter((rental: Rental) => rental.status !== 'completed');
      const historicalRentals = rentals.filter((rental: Rental) => rental.status === 'completed');

      set({ rentals, activeRentals, historicalRentals, loading: false });
    } catch (error: any) {
      set({ error: 'Error fetching rentals', loading: false });
    }
  },

  // Obtener los productos asociados a una renta
  getRentalProducts: async (rentalId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:3001/rentals/${rentalId}/products`);
      set({ rentalProducts: response.data, loading: false });
    } catch (error: any) {
      set({ error: 'Error fetching rental products', loading: false });
    }
  },

  // Completar una renta y actualizar el estado
  completeRental: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.patch(`http://localhost:3001/rentals/${id}/complete`);
      await useRentalStore.getState().fetchRentals(); // Refrescar la lista de rentas
      set({ loading: false });
    } catch (error: any) {
      set({ error: 'Error completing rental', loading: false });
    }
  },

  // Extender la fecha de una renta
  updateRental: async (id: number, data: Partial<Rental>) => {
    set({ loading: true, error: null });
    try {
      await axios.patch(`http://localhost:3001/rentals/${id}`, data);
      await useRentalStore.getState().fetchRentals(); // Refrescar la lista de rentas
      set({ loading: false });
    } catch (error: any) {
      set({ error: 'Error updating rental', loading: false });
    }
  },

  // Crear una nueva renta y retornar el objeto creado
  createRental: async (data: CreateRentalDto) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('http://localhost:3001/rentals', data);
      
      set({ loading: false });
      return response.data; // Asegúrate de retornar la data (el objeto creado)
    } catch (error: any) {
      set({ error: 'Error creating rental', loading: false });
      throw error; // Lanza el error para manejarlo en el frontend
    }
  },

  // Eliminar una renta
  deleteRental: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`http://localhost:3001/rentals/${id}`);
      await useRentalStore.getState().fetchRentals(); // Refrescar la lista de rentas
      set({ loading: false });
    } catch (error: any) {
      set({ error: 'Error deleting rental', loading: false });
    }
  },
}));

export default useRentalStore;
