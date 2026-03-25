import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { PedidoService } from '../../../shared/pedido/pedido.service';
import { BasketService } from '../../../shared/basket/basket';
import { PedidoDetalle } from '../../../shared/pedido/pedido.model';

@Component({
  selector: 'app-checkout-exito',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './checkout-exito.component.html',
  styleUrls: ['./checkout-exito.component.scss']
})
export class CheckoutExitoComponent implements OnInit, OnDestroy {

  pedido: PedidoDetalle | null = null;
  loading = true;
  error = false;
  pedidoId: number | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private pedidoService: PedidoService,
    private basketService: BasketService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Limpiar la cesta después de la compra exitosa
    this.basketService.clear();

    // Obtener el ID del pedido de la URL si existe
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.pedidoId = +params['id'];
        this.cargarPedido(this.pedidoId);
      } else {
        this.cargarUltimoPedido();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarUltimoPedido(): void {
    const sub = this.pedidoService.getMisPedidos().subscribe({
      next: (pedidos) => {
        if (pedidos && pedidos.length > 0) {
          // Ordenar por fecha descendente y tomar el más reciente
          const ultimoPedido = pedidos.sort((a, b) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          )[0];

          this.cargarPedido(ultimoPedido.id);
        } else {
          this.error = true;
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar los pedidos:', error);
        this.error = true;
        this.loading = false;
      }
    });
    this.subscriptions.add(sub);
  }

  cargarPedido(id: number): void {
    this.loading = true;
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
    this.subscriptions.add(sub);
  }

  repetirPedido(): void {
    if (!this.pedido) return;

    const sub = this.pedidoService.repetirPedido(this.pedido.id).subscribe({
      next: (items) => {
        this.basketService.cargarDesdePedido(items);
        this.router.navigate(['/cesta']);
      },
      error: (error) => {
        console.error('Error al repetir el pedido:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  getSubtotal(): number {
    return this.pedido?.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    ) || 0;
  }

  getSubtotalSinIva(): number {
    return this.pedido?.total ? +(this.pedido.total / 1.21).toFixed(2) : 0;
  }

  getIva(): number {
  return this.pedido?.total ? +(this.pedido.total - this.getSubtotalSinIva()).toFixed(2) : 0;
}

  getTotal(): number {
    return this.pedido?.total || 0;
  }

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

  getEstadoTexto(): string {
    return this.pedido?.estado || 'Desconocido';
  }

  imprimirPedido(): void {
    window.print();
  }
}
