import { Component, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { HasRoleDirective } from "../directives/has-role";
import { BasketService } from "../../shared/basket/basket";
import { Subscription } from "rxjs";

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HasRoleDirective,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  totalCesta = 0;
  userEmail: string = '';
  navbarHidden = false;
  private lastScrollTop = 0;
  private backetSubscription!: Subscription;
  private scrollListener!: () => void;

  constructor(
    private authService: AuthService,
    private basketService: BasketService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.backetSubscription = this.basketService.items$.subscribe(items => {
      this.totalCesta = items.reduce(
        (total, items) => total + items.quantity,
        0
      );
    });
    this.userEmail = this.authService.getEmail() ?? '';

    // Añadir listener de scroll con Renderer2
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      this.onWindowScroll();
    });
  }

  ngOnDestroy(): void {
    if (this.backetSubscription) {
      this.backetSubscription.unsubscribe();
    }
    // Eliminar listener cuando el componente se destruye
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  onWindowScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Ocultar navbar cuando se hace scroll hacia abajo y mostrar hacia arriba
    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      if (!this.navbarHidden) {
        this.navbarHidden = true;
        this.renderer.addClass(document.body, 'navbar-hidden');
      }
    } else {
      if (this.navbarHidden) {
        this.navbarHidden = false;
        this.renderer.removeClass(document.body, 'navbar-hidden');
      }
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  get isLogged(): boolean {
    return this.authService.isLogged();
  }

  getUserInitials(): string {
    return this.userEmail
      ? this.userEmail.charAt(0).toUpperCase()
      : 'U';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }

  goPrueba(): void {
    this.router.navigate(['/prueba']);
  }

  goAdmin(): void {
    this.router.navigate(['/admin']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getRoles(): string[] {
    return this.authService.getRoles();
  }
}
