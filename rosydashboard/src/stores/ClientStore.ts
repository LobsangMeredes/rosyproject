import create from 'zustand';
import apiClient from 'config/AxiosConfig';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface CreateClientDto {
  name: string;
  email: string;
  phone: string;
}

interface UpdateClientDto {
  name: string;
  email: string;
  phone: string;
}

interface ClientStore {
  clients: Client[];
  clientDetails: Client | null;
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  fetchClientById: (id: number) => Promise<void>;
  createClient: (data: CreateClientDto) => Promise<void>;
  updateClient: (id: number, data: UpdateClientDto) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
}

const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  clientDetails: null,
  loading: false,
  error: null,

  // Obtener todos los clientes
  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/clients');
      set({ clients: response.data, loading: false });
    } catch (error: any) {
      set({ error: 'Error fetching clients', loading: false });
    }
  },

  // Obtener un cliente por ID
  fetchClientById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/clients/${id}`);
      set({ clientDetails: response.data, loading: false });
    } catch (error: any) {
      set({ error: 'Error fetching client details', loading: false });
    }
  },

  // Crear un nuevo cliente
  createClient: async (data: CreateClientDto) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post('/clients', data);
      await useClientStore.getState().fetchClients(); // Refrescar la lista de clientes
      set({ loading: false });
    } catch (error: any) {
      set({ error: 'Error creating client', loading: false });
    }
  },

  // Actualizar un cliente
  updateClient: async (id: number, data: UpdateClientDto) => {
    set({ loading: true, error: null });
    try {
      await apiClient.patch(`/clients/${id}`, data);
      await useClientStore.getState().fetchClients(); // Refrescar la lista de clientes
      set({ loading: false });
    } catch (error: any) {
      set({ error: 'Error updating client', loading: false });
    }
  },

  // Eliminar un cliente
  deleteClient: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/clients/${id}`);
      await useClientStore.getState().fetchClients(); // Refrescar la lista de clientes
      set({ loading: false });
    } catch (error: any) {
      set({ error: 'Error deleting client', loading: false });
    }
  },
}));

export default useClientStore;
