import React, { useEffect, useState } from "react";
import useClientStore from "stores/ClientStore";
import useProductStore from "stores/ProductsStore";
import useRentalStore from "stores/RentalStore";
import useInvoiceStore from "stores/InvoicesStore";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import jsPDF from "jspdf";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// Función para convertir la fecha al formato "YYYY-MM-DD HH:mm:ss"
const formatDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Función para calcular los días restantes
const calculateDaysLeft = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const timeDiff = end.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff >= 0 ? daysDiff : 0;
};

const InvoicePage: React.FC = () => {
  const { clients, fetchClients, createClient } = useClientStore();
  const { products, fetchProducts } = useProductStore();
  const { createRental, getRentalProducts, rentalProducts, loading } =
    useRentalStore();
  const { invoices, fetchInvoices, createInvoice, updateInvoice } =
    useInvoiceStore();

  const [selectedClient, setSelectedClient] = useState(null);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [additionalAmount, setAdditionalAmount] = useState(0);
  const [isNewClient, setIsNewClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Estado para la pestaña activa

  useEffect(() => {
    fetchClients();
    fetchProducts();
    fetchInvoices();
  }, [fetchClients, fetchProducts, fetchInvoices]);

  useEffect(() => {
    console.log("Facturas recibidas:", invoices);
  }, [invoices]);

  useEffect(() => {
    // Cargar productos automáticamente cuando cambia la pestaña activa
    if (activeIndex !== null && invoices[activeIndex]) {
      const rentalId = invoices[activeIndex].rentalId;
      getRentalProducts(rentalId);
    }
  }, [activeIndex, invoices, getRentalProducts]);

  const handleCreateInvoice = async () => {
    if (!selectedClient && !isNewClient) {
      alert("Por favor, selecciona o crea un cliente.");
      return;
    }

    if (!selectedProducts.length) {
      alert("Por favor, selecciona al menos un producto.");
      return;
    }

    if (!endDate) {
      alert("Por favor, selecciona una fecha de fin.");
      return;
    }

    let clientId = selectedClient?.id;
    if (isNewClient) {
      const clientData = { ...newClient };
      await createClient(clientData);
      clientId = clients.find(
        (client) => client.email === clientData.email
      )?.id;
    }

    clientId = parseInt(clientId, 10);
    if (isNaN(clientId)) {
      alert("El ID del cliente no es válido.");
      return;
    }

    const startDate = formatDateTime(new Date());
    const formattedEndDate = formatDateTime(endDate);

    const rentalData = {
      startDate,
      endDate: formattedEndDate,
      productIds: selectedProducts.map((product) => product.id),
      clientId,
      status: "active",
    };

    try {
      const createdRental = await createRental(rentalData);
      const rentalId = createdRental?.id;

      if (!rentalId) {
        throw new Error("No se pudo obtener el ID de la renta.");
      }

      const invoiceData = {
        rentalId: parseInt(rentalId, 10),
        clientId: parseInt(clientId, 10),
        total: parseFloat(additionalAmount + 500), // 500 DOP como valor fijo
        issueDate: Date.now().toString(),
      };

      console.log("Datos de la factura a enviar:", invoiceData);

      await createInvoice(rentalId, clientId, invoiceData.total);
      alert("Factura creada exitosamente.");
    } catch (error) {
      console.error("Error al crear la factura o renta:", error);
      alert("Error al crear la factura o renta.");
    }
  };

  const handleCompleteInvoice = async (id: number) => {
    try {
      await updateInvoice(id, { status: "paid" });
      alert("Factura marcada como pagada exitosamente.");
    } catch (error) {
      alert("Error al completar la factura.");
      console.error(error);
    }
  };

  const handleDownloadPDF = (invoice: any) => {
    const doc = new jsPDF();
  
    // Variables para el desglose de precios
    const guaranteeAmount = 500; // Monto de garantía fijo
    const rentalAmount = invoice.total; // Monto de alquiler introducido
    const totalAmount = rentalAmount + guaranteeAmount; // Monto total = Alquiler + Garantía
  
    // Encabezado
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text("Tienda de Alquiler de Rosy Badia", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Factura #${invoice.id}`, 105, 25, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30); // Línea separadora
  
    // Información del cliente
    doc.setFontSize(12);
    doc.text("Datos del Cliente:", 20, 40);
    doc.setFontSize(10);
    doc.text(`Nombre: ${invoice.client?.name || "N/A"}`, 20, 50);
    doc.text(`Teléfono: ${invoice.client?.phone || "N/A"}`, 20, 55);
    doc.text(`Correo: ${invoice.client?.email || "N/A"}`, 20, 60);
  
    // Información de la factura
    doc.setFontSize(12);
    doc.text("Datos de la Factura:", 140, 40);
    doc.setFontSize(10);
    doc.text(`Monto de Alquiler: ${rentalAmount} DOP`, 140, 50);
    doc.text(`Garantía: ${guaranteeAmount} DOP`, 140, 55);
    doc.text(`Monto Total: ${totalAmount} DOP`, 140, 60);

    doc.text(`Estado: ${invoice.status}`, 140, 70);
  
    // Espacio entre las secciones
    doc.line(20, 75, 190, 75); // Línea separadora
  
    // Tabla de productos
    doc.setFontSize(12);
    doc.text("Productos:", 20, 85);
  
    // Dibujar encabezados de tabla
    const startX = 20;
    const startY = 95;
    doc.setFontSize(10);
    doc.text("Producto", startX, startY);
    doc.text("Código de Inventario", startX + 70, startY);
    doc.text("Cantidad", startX + 130, startY);
  
    // Dibujar líneas de encabezado
    doc.line(20, startY + 2, 190, startY + 2);
  
    // Productos
    let currentY = startY + 10;
    rentalProducts.forEach((product: any, index: number) => {
      doc.text(`${product.name}`, startX, currentY);
      doc.text(`${product.inventoryCode}`, startX + 70, currentY);
      doc.text("1", startX + 130, currentY); // Asumiendo que la cantidad es 1 para todos los productos
      currentY += 10;
    });
  
    // Dibujar líneas finales
    doc.line(20, currentY, 190, currentY); // Línea inferior de la tabla
    currentY += 10; // Espacio después de la tabla
  
    // Desglose de precios
    doc.setFontSize(12);
    doc.text("Desglose de Precios:", 20, currentY);
    currentY += 10;
    doc.text(`Monto de Alquiler: ${rentalAmount} DOP`, 20, currentY);
    currentY += 10;
    doc.text(`Garantía: ${guaranteeAmount} DOP`, 20, currentY);
    currentY += 10;
    doc.text(`Monto Total: ${totalAmount} DOP`, 20, currentY);
  
    currentY += 20;
  
    // Política de Garantía
    doc.setFontSize(10);
    doc.text("Política de Garantía:", 20, currentY);
    currentY += 10;
    const policyText = `
    Al momento de realizar cualquier alquiler se deben dejar 500 pesos como 
    garantía, que le será devuelta cuando devuelvan la prenda en cuestión.
    En caso de exceder el plazo de entrega de la prenda, se le reducirá 100 
    pesos por día transcurrido. Si la prenda alquilada se rompe o se daña, 
    no se le devolverá el monto de la garantía.`;
  
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(policyText, 170), 20, currentY);
  
    // Guardar el archivo PDF
    doc.save(`factura_${invoice.id}-${invoice.client.name}.pdf`);
  };
  
  
  
  

  return (
    <div className="invoice-page">
      <h1>Crear Factura</h1>

      <div className="field">
        <h3>Cliente</h3>
        <Dropdown
          value={selectedClient}
          options={clients}
          onChange={(e) => setSelectedClient(e.value)}
          optionLabel="name"
          placeholder="Selecciona un cliente existente"
          disabled={isNewClient}
        />
        <Button
          label="Crear Cliente Nuevo"
          onClick={() => setIsNewClient(!isNewClient)}
        />
        {isNewClient && (
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Email"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
            />
          </div>
        )}
      </div>

      <div className="field">
        <h3>Buscar Productos</h3>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <MultiSelect
          value={selectedProducts}
          options={products.filter((product) =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onChange={(e) => setSelectedProducts(e.value)}
          optionLabel="name"
          placeholder="Selecciona productos"
          display="chip"
        />
      </div>

      <div className="field">
        <h3>Fecha de Fin</h3>
        <Calendar
          value={endDate}
          onChange={(e) => setEndDate(e.value)}
          minDate={new Date()}
          placeholder="Selecciona fecha de fin"
          showIcon
        />
      </div>

      <div className="field">
        <h3>Monto Adicional (opcional)</h3>
        <InputNumber
          value={additionalAmount}
          onValueChange={(e) => setAdditionalAmount(e.value)}
          placeholder="Monto adicional en DOP"
        />
      </div>

      <Button
        label="Crear Factura"
        onClick={handleCreateInvoice}
        className="p-button-success"
      />

      <h2>Facturas</h2>
      <Accordion
        multiple
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)} // Cambiar el índice de la pestaña activa
      >
        {invoices.map((invoice, idx) => (
          <AccordionTab key={invoice.id} header={`Factura #${invoice.id} - Cliente: ${invoice.client?.name}`}>
            <p>
              <strong>ID Renta:</strong> {invoice.rentalId}
            </p>

            {/* Mostrar información del cliente */}
            {invoice.client ? (
              <>
                <p>
                  <strong>Cliente:</strong> {invoice.client?.name || "N/A"}
                </p>
                <p>
                  <strong>Teléfono:</strong> {invoice.client?.phone || "N/A"}
                </p>
                <p>
                  <strong>Correo:</strong> {invoice.client?.email || "N/A"}
                </p>
              </>
            ) : (
              <p>
                <strong>Cliente:</strong> Información no disponible
              </p>
            )}

            {/* Mostrar información de la renta */}
            {invoice.rental ? (
              <>
                <p>
                  <strong>Fecha de Inicio:</strong> {invoice.rental.startDate}
                </p>
                <p>
                  <strong>Fecha de Fin:</strong> {invoice.rental.endDate}
                </p>
                <p>
                  <strong>Días Restantes:</strong>{" "}
                  {calculateDaysLeft(invoice.rental.endDate)} días
                </p>

                <p>
                  <strong>Productos:</strong>
                </p>

                {loading ? (
                  <p>Cargando productos...</p>
                ) : (
                  <DataTable value={rentalProducts}>
                    <Column field="name" header="Nombre del Producto"></Column>
                    <Column
                      field="inventoryCode"
                      header="Código de Inventario"
                    ></Column>
                    <Column field="size" header="Tamaño"></Column>
                  </DataTable>
                )}
              </>
            ) : (
              <p>
                <strong>Renta:</strong> Información no disponible
              </p>
            )}

            <p>
              <strong>Monto Total:</strong> {invoice.total} DOP
            </p>
            <p>
              <strong>Estado:</strong> {invoice.status}
            </p>

            <Button
              label="Marcar como Pagado"
              icon="pi pi-check"
              className="p-button-success"
              onClick={() => handleCompleteInvoice(invoice.id)}
              disabled={invoice.status === "paid"}
            />
            <Button
              label="Descargar Factura en PDF"
              icon="pi pi-file-pdf"
              className="p-button-info"
              onClick={() => handleDownloadPDF(invoice)}
            />
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default InvoicePage;
