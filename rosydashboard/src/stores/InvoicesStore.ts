import create from 'zustand';
import axios from 'axios';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Product {
  id: number;
  name: string;
}

interface Rental {
  id: number;
  startDate: string;
  endDate: string;
  products: Product[];
  client: Client;
}

interface Invoice {
  id: number;
  rentalId: number;
  total: number;
  issueDate: string;
  status: string;
  client?: Client;
  rental?: Rental;
}

interface InvoiceStore {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<void>;
  createInvoice: (rentalId: number, clientId: number, total: number) => Promise<Invoice | null>;
  fetchInvoiceById: (id: number) => Promise<Invoice | null>;
  updateInvoice: (id: number, data: Partial<Invoice>) => Promise<void>;
}

const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  loading: false,
  error: null,

  // Obtener todas las facturas
// fetchInvoices en InvoiceStore
fetchInvoices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('http://localhost:3001/invoices');
      console.log(response.data); // Para ver los datos que devuelve la API
      set({ invoices: response.data, loading: false });
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      set({ error: 'Error fetching invoices', loading: false });
    }
  },
  

  // Crear una factura asociada a una renta
  createInvoice: async (rentalId: number, clientId: number, total: number) => {
    set({ loading: true, error: null });
    try {
      const invoiceData = {
        rentalId,
        clientId,
        total,
      };
      const response = await axios.post('http://localhost:3001/invoices', invoiceData);
      await useInvoiceStore.getState().fetchInvoices();
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      set({ error: 'Error creating invoice', loading: false });
      return null;
    }
  },

  // Obtener una factura por su ID
  fetchInvoiceById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:3001/invoices/${id}`);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching invoice details:', error);
      set({ error: 'Error fetching invoice details', loading: false });
      return null;
    }
  },

  updateInvoice: async (id: number, data: Partial<Invoice>) => {
    set({ loading: true, error: null });
    try {
      await axios.patch(`http://localhost:3001/invoices/${id}`, data);
      await useInvoiceStore.getState().fetchInvoices();
      set({ loading: false });
    } catch (error: any) {
      console.error('Error updating invoice:', error);
      set({ error: 'Error updating invoice', loading: false });
    }
  },
}));

export default useInvoiceStore;
