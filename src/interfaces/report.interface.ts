import { Product } from "./product.interface";
import { Warehouse } from "./warehouse.interface";

export interface Report {
  warehouse: Warehouse;
  product: Product;
  dus_stock: number;
  pcs_stock: number;
}
