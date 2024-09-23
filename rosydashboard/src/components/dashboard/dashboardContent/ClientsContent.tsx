import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast'; // Importamos Toast para notificaciones
import { Dialog } from 'primereact/dialog';
import useClientStore from 'stores/ClientStore';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const ClientsPage: React.FC = () => {
  const { clients, fetchClients, createClient, deleteClient } = useClientStore();
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const toast = useRef<Toast>(null); // Ref para las notificaciones
  const [confirmDelete, setConfirmDelete] = useState<{ visible: boolean, clientId: number | null }>({
    visible: false,
    clientId: null
  });

  useEffect(() => {
    fetchClients(); // Cargar los clientes al montar el componente
  }, [fetchClients]);

  // Crear un nuevo cliente
  const handleCreateClient = async () => {
    try {
      await createClient(newClient);
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado exitosamente', life: 3000 });
      setNewClient({ name: '', email: '', phone: '' });
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al crear cliente', life: 3000 });
    }
  };

  // Confirmar y eliminar un cliente
  const handleDeleteClient = async () => {
    if (confirmDelete.clientId) {
      try {
        await deleteClient(confirmDelete.clientId);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado exitosamente', life: 3000 });
        setConfirmDelete({ visible: false, clientId: null });
      } catch (error) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar cliente', life: 3000 });
      }
    }
  };

  // Abre el diálogo de confirmación para eliminar un cliente
  const confirmDeleteClient = (clientId: number) => {
    setConfirmDelete({ visible: true, clientId });
  };

  const deleteDialogFooter = (
    <div>
      <Button label="No" icon="pi pi-times" onClick={() => setConfirmDelete({ visible: false, clientId: null })} className="p-button-text" />
      <Button label="Sí" icon="pi pi-check" onClick={handleDeleteClient} className="p-button-danger" />
    </div>
  );

  return (
    <div>
      <Toast ref={toast} /> {/* Toast para notificaciones */}
      
      <h1>Gestión de Clientes</h1>

      {/* Tabla de Clientes */}
      <DataTable value={clients} paginator rows={10} responsiveLayout="scroll" emptyMessage="No hay clientes disponibles">
        <Column field="name" header="Nombre" sortable></Column>
        <Column field="email" header="Correo" sortable></Column>
        <Column field="phone" header="Teléfono" sortable></Column>
        <Column
          body={(rowData) => (
            <Button
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={() => confirmDeleteClient(rowData.id)}
            />
          )}
          header="Acciones"
        ></Column>
      </DataTable>

      {/* Formulario para agregar cliente */}
      <h2>Agregar Cliente</h2>
      <div className="p-field">
        <label htmlFor="name">Nombre</label>
        <InputText
          id="name"
          value={newClient.name}
          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          placeholder="Ingrese el nombre del cliente"
        />
      </div>
      <div className="p-field">
        <label htmlFor="email">Correo</label>
        <InputText
          id="email"
          value={newClient.email}
          onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
          placeholder="Ingrese el correo del cliente"
        />
      </div>
      <div className="p-field">
        <label htmlFor="phone">Teléfono</label>
        <InputText
          id="phone"
          value={newClient.phone}
          onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
          placeholder="Ingrese el teléfono del cliente"
        />
      </div>

      <Button label="Crear Cliente" icon="pi pi-plus" className="p-button-success" onClick={handleCreateClient} />

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        visible={confirmDelete.visible}
        style={{ width: '350px' }}
        header="Confirmar"
        modal
        footer={deleteDialogFooter}
        onHide={() => setConfirmDelete({ visible: false, clientId: null })}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem' }} />
          {confirmDelete.clientId && <span>¿Estás seguro de eliminar este cliente?</span>}
        </div>
      </Dialog>
    </div>
  );
};

export default ClientsPage;
