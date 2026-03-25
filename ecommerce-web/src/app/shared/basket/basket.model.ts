import { Producto } from "../../core/productos/producto.model";



export interface BasketItem {
  product: Producto;
  quantity: number;
}
