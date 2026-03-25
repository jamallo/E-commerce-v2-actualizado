import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { BasketService } from '../../basket/basket';
import { MiniCestaComponent } from '../../mini-cesta/mini-cesta.component/mini-cesta.component';
import { MatButtonModule } from "@angular/material/button";
import { MatBadgeModule } from "@angular/material/badge";
import { MatIconModule } from "@angular/material/icon";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cesta-flotante',
  standalone: true,
  imports: [
    CommonModule,
    MiniCestaComponent,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule
  ],
  templateUrl: './cesta-flotante.component.html',
  styleUrls: ['./cesta-flotante.component.scss']
})
export class CestaFlotanteComponent implements OnInit, OnDestroy {
  totalItems = 0;
  animar = false;
  mostrarMiniCesta = false;
  private subscriptions: Subscription[] = [];
  private animationTimeout: any;

  constructor(
    private basketService: BasketService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Suscripción a items de la cesta
    this.subscriptions.push(
      this.basketService.items$.subscribe(items => {
        this.totalItems = items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      })
    );

    // Suscripción a animación cuando se añade producto
    this.subscriptions.push(
      this.basketService.productoAniadido$.subscribe(() => {
        // Usamos NgZone para asegurar que la animación se ejecute correctamente
        this.ngZone.run(() => {
          this.animar = true;

          // Limpiamos timeout anterior si existe
          if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
          }

          // Quitamos la animación después
          this.animationTimeout = setTimeout(() => {
            this.ngZone.run(() => {
              this.animar = false;
            });
          }, 400);
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  toggleMiniCesta(): void {
    this.mostrarMiniCesta = !this.mostrarMiniCesta;
  }

  cerrarMiniCesta(): void {
    this.mostrarMiniCesta = false;
  }
}
