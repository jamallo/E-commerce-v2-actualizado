import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidoDetalle } from '../../../shared/pedido/pedido.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PedidoService } from '../../../shared/pedido/pedido.service';
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
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-pedido-detalle',
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
    MatBadgeModule
  ],
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.scss']
})
export class PedidoDetalleComponent implements OnInit, OnDestroy {

  pedido?: PedidoDetalle;
  loading = true;
  error = false;
  private subscription = new Subscription();

  // Columnas para la tabla de Material
  displayedColumns: string[] = ['producto', 'cantidad', 'precioUnitario', 'subtotal'];

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private basketService: BasketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDetallePedido();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarDetallePedido(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(id)) {
      this.error = true;
      this.loading = false;
      return;
    }

    const sub = this.pedidoService.obtenerDetalle(id).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar el detalle del pedido:', error);
        this.error = true;
        this.loading = false;
      }
    });

    this.subscription.add(sub);
  }

  repetirPedido(id: number): void {
    const sub = this.pedidoService.repetirPedido(id).subscribe({
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

  volverAMisPedidos(): void {
    this.router.navigate(['/perfil/pedidos']);
  }

  // Métodos auxiliares
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoClass(): string {
    switch(this.pedido?.estado?.toLowerCase()) {
      case 'pendiente': return 'estado-pendiente';
      case 'pagado':
      case 'completado': return 'estado-pagado';
      case 'enviado': return 'estado-enviado';
      case 'entregado': return 'estado-entregado';
      case 'cancelado': return 'estado-cancelado';
      default: return '';
    }
  }

  getEstadoIcon(): string {
    switch(this.pedido?.estado?.toLowerCase()) {
      case 'pendiente': return 'schedule';
      case 'pagado':
      case 'completado': return 'check_circle';
      case 'enviado': return 'local_shipping';
      case 'entregado': return 'home';
      case 'cancelado': return 'cancel';
      default: return 'help';
    }
  }

  getSubtotalSinIva(): number {
    return this.pedido?.total ? +(this.pedido.total / 1.21).toFixed(2) : 0;
  }

  getIva(): number {
    return this.pedido?.total ? +(this.pedido.total - this.getSubtotalSinIva()).toFixed(2) : 0;
  }

  imprimirPagina(): void {
  window.print();
}
}
