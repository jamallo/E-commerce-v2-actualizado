//import { Injectable } from '@angular/core';
import { BasketItem } from '../basket/basket.model';


export interface DireccionEnvio {
  nombre: string;
  apellidos: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
  telefono: string;
}

export interface Pedido {
  items: BasketItem[];
  direccion: DireccionEnvio;
  total: number;
  fecha?: Date;
}

export interface PedidoHistoriaDTO {
  id: number;
  fecha: string;
  total: number;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'ENVIADO';
}

export interface PedidoItem {
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoDetalle {
  id: number;
  fecha: string;
  estado: string;
  total: number;
  items: PedidoItem[];
}

export interface PedidoRepetirItem {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface PedidoDetalleDTO {
  id: number;
  fecha: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'ENVIADO';
  total: number;
  items: PedidoItem[];
  // Información de envío
  nombre: string;
  apellidos: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
  telefono: string;
}

export interface PedidoRepetirItemDTO {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface ItemCheckoutDTO {
  productoId: number;
  cantidad: number;
}

export interface CheckoutRequestDTO {
  items: ItemCheckoutDTO[];
  direccion: DireccionEnvio;
}

export interface PedidoResponseDTO {
  id: number;
  total: number;
  estado: string;
  fechaCreacion: string;
}

/* @Injectable({
  providedIn: 'root',
})
export class PedidoService {
  crearPedido(pedido: Pedido): void {
  //TODO
  console.log('Pedido creado: ' + pedido)
    }
} */
