import React, { useEffect, useState, useRef } from 'react';
import useRentalStore from 'stores/RentalStore'; // Tu store de Zustand
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toast } from 'primereact/toast'; // Importando Toast
import 'primereact/resources/themes/saga-blue/theme.css';  // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Función para convertir la fecha al formato "YYYY-MM-DD HH:mm:ss"
const formatDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const RentalsPage: React.FC = () => {
  const { activeRentals, historicalRentals, fetchRentals, loading, error, updateRental, completeRental } = useRentalStore();
  const [newEndDate, setNewEndDate] = useState<Date | null>(null);
  const [selectedRental, setSelectedRental] = useState<number | null>(null);
  const toast = useRef<Toast>(null); // Ref para Toast

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  // Función para calcular los días restantes
  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft > 0 ? daysLeft : 0; // Si la fecha ya pasó, mostramos 0 días
  };

  // Función para extender la renta
  const onExtendRental = async (rentalId: number) => {
    if (newEndDate && selectedRental === rentalId) {
      try {
        if (isNaN(newEndDate.getTime())) {
          throw new Error("Fecha seleccionada no válida");
        }
        const updatedEndDate = formatDateTime(newEndDate);
        const dataToSend = { endDate: updatedEndDate };
        await updateRental(rentalId, dataToSend);
        setNewEndDate(null);
        setSelectedRental(null);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Renta extendida exitosamente', life: 3000 });
      } catch (error) {
        console.error("Error al extender la renta:", error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al extender la renta', life: 3000 });
      }
    }
  };

  // Función para completar la renta
  const onCompleteRental = async (rentalId: number) => {
    try {
      await completeRental(rentalId);
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Renta completada exitosamente', life: 3000 });
    } catch (error) {
      console.error("Error al completar la renta:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al completar la renta', life: 3000 });
    }
  };

  // Renderizar el botón para extender la renta
  const extendButtonTemplate = (rowData: any) => (
    <>
      <Calendar
        value={selectedRental === rowData.id ? newEndDate : null}
        onChange={(e) => {
          setSelectedRental(rowData.id);
          setNewEndDate(e.value);
        }}
        placeholder="Selecciona nueva fecha"
        minDate={new Date()}
        showIcon
      />
      <Button
        label="Extender"
        icon="pi pi-calendar-plus"
        className="p-button-info"
        disabled={!newEndDate || selectedRental !== rowData.id}
        onClick={() => onExtendRental(rowData.id)}
      />
    </>
  );

  // Renderizar el botón para completar la renta
  const completeButtonTemplate = (rowData: any) => (
    <Button
      label="Completar"
      icon="pi pi-check"
      className="p-button-success"
      onClick={() => onCompleteRental(rowData.id)}
    />
  );

  // Función para renderizar los nombres de los productos enumerados
  const productsTemplate = (rowData: any) => {
    if (!rowData.products || rowData.products.length === 0) return '';  // Si no hay productos, no mostrar nada
    return rowData.products
      .map((p: any, index: number) => `${index + 1}. ${p.product?.name || ''}`) // Enumerar productos
      .join(', '); // Únelos con comas
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="rental-page">
      <Toast ref={toast} /> {/* Componente Toast */}
      <h1>Gestión de Alquileres</h1>

      <Accordion multiple>
        {/* Tabla de Rentas Activas */}
        <AccordionTab header="Rentas Activas">
          <DataTable value={activeRentals} responsiveLayout="scroll" paginator rows={10}>
            <Column field="id" header="ID" />
            <Column field="client.name" header="Cliente" />
            <Column field="startDate" header="Fecha de Inicio" />
            <Column field="endDate" header="Fecha de Fin" />
            <Column field="products" header="Productos" body={productsTemplate} />
            <Column field="daysLeft" header="Días Restantes" body={(rowData) => calculateDaysLeft(rowData.endDate)} />
            <Column body={extendButtonTemplate} header="Extender Renta" />
            <Column body={completeButtonTemplate} header="Completar Renta" />
          </DataTable>
        </AccordionTab>

        {/* Tabla de Rentas Históricas */}
        <AccordionTab header="Rentas Históricas">
          <DataTable value={historicalRentals} responsiveLayout="scroll" paginator rows={10}>
            <Column field="id" header="ID" />
            <Column field="client.name" header="Cliente" />
            <Column field="startDate" header="Fecha de Inicio" />
            <Column field="endDate" header="Fecha de Fin" />
            <Column field="products" header="Productos" body={productsTemplate} />
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default RentalsPage;
