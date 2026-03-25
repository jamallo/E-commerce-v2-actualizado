import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BasketItem } from '../../shared/basket/basket.model';
import { BasketService } from '../../shared/basket/basket';
import { ConfirmacionService } from '../../shared/confirmacion/confirmacion.service';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cesta.html',
  styleUrls: ['./cesta.scss']
})
export class CestaComponent implements OnInit {
  items: BasketItem[] = [];
  total = 0;

  constructor(
    private basketService: BasketService,
    private confirmacionService: ConfirmacionService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.basketService.items$.subscribe(items => {
      this.items = items;
      this.total = this.basketService.getTotal();
    });
  }

  sumar(item: BasketItem): void {
    this.basketService.add(item.product);
  }

  restar(item: BasketItem): void {
    if (item.quantity > 1) {
      this.basketService.decrease(item.product.id);
    }
  }

  eliminar(productId: number): void {
    this.confirmacionService.confirmar({
      titulo: 'Eliminar producto',
      mensaje: '¿Seguro que quieres eliminar este producto de la cesta?',
      textoConfirmar: 'Eliminar',
      textoCancelar: 'Cancelar'
    }).subscribe(confirmado => {
      if (confirmado) {
        this.basketService.remove(productId);
      }
    });
  }

  vaciar(): void {
    this.confirmacionService.confirmar({
      titulo: 'Vaciar cesta',
      mensaje: '¿Seguro que quieres eliminar todos los productos?',
      textoConfirmar: 'Vaciar',
      textoCancelar: 'Cancelar'
    }).subscribe(confirmado => {
      if (confirmado) {
        this.basketService.clear();
      }
    });
  }

  finalizarCompra(): void {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/login'], {
        queryParams: { redirect: '/checkout' }
      });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}

/* import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BasketItem } from '../../shared/basket/basket.model';
import { BasketService } from '../../shared/basket/basket';
import { ConfirmacionService } from '../../shared/confirmacion/confirmacion.service';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cesta.html',
  styleUrl: './cesta.scss',
})
export class CestaComponent implements OnInit {

  items: BasketItem[] = [];
  total = 0;

  constructor(
    private basketService: BasketService,
    private confirmacionService: ConfirmacionService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.basketService.items$.subscribe(items => {
      this.items = items;
      this.total = this.basketService.getTotal();
    });
  }

  sumar(item: BasketItem): void {
    this.basketService.add(item.product);
  }

  restar(item: BasketItem): void {
    this.basketService.decrease(item.product.id);
  }

  eliminar(productId: number): void {
    this.basketService.remove(productId);
  }

  vaciar(): void {
    this.confirmacionService.confirmar({
      titulo: 'Vaciar cesta',
      mensaje: '¿Seguro que quieres eliminar todos los productos?',
      textoConfirmar: 'Vaciar',
      textoCancelar: 'Cancelar'
    }).subscribe(confirmado => {
      if (confirmado) {
        this.basketService.clear();
      }
    });

  }

  finalizarCompra(): void {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/login'], {
        queryParams: {redirect: '/checkout'}
      });
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
 */
