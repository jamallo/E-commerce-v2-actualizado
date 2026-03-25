import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output, OnDestroy, OnInit } from '@angular/core';
//import { RouterLink } from '@angular/router';
import { BasketItem } from '../../basket/basket.model';
import { BasketService } from '../../basket/basket';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mini-cesta',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './mini-cesta.component.html',
  styleUrl: './mini-cesta.component.scss',
})
export class MiniCestaComponent implements OnInit, OnDestroy{

  items: BasketItem[] = [];
  total = 0;

  @Output() cerrar = new EventEmitter<void>();

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  constructor(private basketService: BasketService) {
    this.basketService.items$.subscribe(items => {
      this.items = items.slice(-3).reverse();
      this.total = this.basketService.getTotal();
    });
  }

  cerrarPanel(): void {
    this.cerrar.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.cerrarPanel();
  }
}
