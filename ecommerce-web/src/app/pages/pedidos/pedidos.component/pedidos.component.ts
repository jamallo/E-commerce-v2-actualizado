import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidoHistoriaDTO } from '../../../shared/pedido/pedido.model';
import { PedidoService } from '../../../shared/pedido/pedido.service';
import { Router, RouterLink } from "@angular/router";
import { BasketService } from '../../../shared/basket/basket';
import { Subscription } from 'rxjs';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    // Material Modules
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule
  ],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit, OnDestroy {

  pedidos: PedidoHistoriaDTO[] = [];
  cargando = true;
  error = false;

  private subscription = new Subscription();

  // Columnas para la tabla
  displayedColumns: string[] = ['id', 'fecha', 'total', 'estado', 'acciones'];

  constructor(
    private pedidoService: PedidoService,
    private basketService: BasketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.error = false;

    const sub = this.pedidoService.getMisPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
        this.error = true;
        this.cargando = false;
      }
    });

    this.subscription.add(sub);
  }

  repetirPedido(pedidoId: number): void {
    const sub = this.pedidoService.repetirPedido(pedidoId).subscribe({
      next: (items) => {
        this.basketService.cargarDesdePedido(items);
        this.router.navigate(['/cesta']);
      },
      error: (error) => {
        console.error('Error al repetir el pedido:', error);
      }
    });

    this.subscription.add(sub);
  }

  verDetalle(pedidoId: number): void {
    this.router.navigate(['/pedidos', pedidoId]);
  }

  // Métodos auxiliares para estilos
  getEstadoClass(estado: string): string {
    switch(estado?.toLowerCase()) {
      case 'pendiente': return 'estado-pendiente';
      case 'pagado':
      case 'completado': return 'estado-pagado';
      case 'enviado': return 'estado-enviado';
      case 'entregado': return 'estado-entregado';
      case 'cancelado': return 'estado-cancelado';
      default: return '';
    }
  }

  getEstadoIcon(estado: string): string {
    switch(estado?.toLowerCase()) {
      case 'pendiente': return 'schedule';
      case 'pagado':
      case 'completado': return 'check_circle';
      case 'enviado': return 'local_shipping';
      case 'entregado': return 'home';
      case 'cancelado': return 'cancel';
      default: return 'help';
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  recargarPedidos(): void {
    this.cargarPedidos();
  }
}
