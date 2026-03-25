import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Producto } from '../producto.model';
import { BasketService } from '../../../shared/basket/basket';
import { NotificationService } from '../../notification/service';
import { AnimacionesService } from '../../../shared/ui/animaciones.service';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-producto.html',
  styleUrl: './tarjeta-producto.scss',
})
export class TarjetaProductoComponent {


  @Input() producto!: Producto;

  @Input() skeleton = false;

  animando = false;
  textoBoton = 'Añadir a la cesta';

  @ViewChild('imagenProducto', {read: ElementRef})
  imagenProducto!: ElementRef<HTMLImageElement>;

  get isLogged(): boolean {
    return this.authService.isLogged();
  }

  constructor(
    private basketService: BasketService,
    private notificationService: NotificationService,
    private animacionesService: AnimacionesService,
    private authService: AuthService,
    private router: Router
  ) {}

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://picsum.photos/400/400?random=fallback';
  }

  aniadirACesta(): void {
    if (!this.authService.isLogged()) {
    this.router.navigate(['/login'], {
      queryParams: { redirect: this.router.url }
    });
    return;
    }

    if (this.animando) return; // Evita múltiples clicks durante animación

    this.basketService.add(this.producto);
    this.notificationService.success('✓ Añadido a la cesta');

    const cesta = document.getElementById('cesta-flotante');
    if (this.imagenProducto && cesta) {
      this.animacionesService.volarACesta(
        this.imagenProducto.nativeElement,
        cesta
      );
    }

    this.animando = true;
    this.textoBoton = '✓ Añadido';

    setTimeout(() => {
      this.animando = false;
      this.textoBoton = 'Añadir a la cesta';
    }, 800);
  }
}
