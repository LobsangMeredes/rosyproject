export enum Status {
  disponible = "disponible",
  alquilado = "alquilado"
}

export enum Gender {
  masculino = "masculino",
  femenino = "femenino",
  unisex = "unisex"
}

export enum Condition {
  nuevo = "nuevo",
  usado = "usado"
}

export enum Size {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  XXXL = "XXXL",
  unico = "unico"
}

export enum Type {
  ropa = "ropa",
  calzado = "calzado",
  accesorio = "accesorio",
  otro = "otro"
}

// Definición de la interfaz Product con categoryId
export interface Product {
  id: number;
  inventoryCode: string;
  name: string;
  categoryId: number;  // Usar categoryId en lugar de category
  type: string;
  gender: string;
  description?: string;
  quantity: number;
  availableCount: number;
  rentedCount: number;
  size?: string;
  condition?: string;
  area?: string;
  box?: string;
  status: string;
  acquisitionDate: string;
}
