import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PruebaComponent } from './prueba/prueba.component';
import { authGuard } from './auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { roleGuard } from './core/guards/role.guard';
import { ProductoListComponent } from './core/productos/producto-list/producto-list.component';
import { ProductoForm } from './core/productos/producto-form/producto-form';
//import { CheckoutComponent } from './pages/checkout/checkout';
import { CheckoutExitoComponent } from './pages/checkout/checkout-exito.component/checkout-exito.component';


export const routes: Routes = [
  { path: '',
    redirectTo: 'productos',
    pathMatch: 'full'},

  { path: 'productos',
    component: ProductoListComponent},

  { path: 'login',
    component: LoginComponent},

  { path: 'cesta',
    loadComponent: () =>
      import('./basket/cesta/cesta').then(m => m.CestaComponent)},

  { path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout').then(m => m.CheckoutComponent),
    canActivate: [authGuard]},

  { path: 'checkout/exito',
    component: CheckoutExitoComponent},

  { path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.component/perfil.component').then(m => m.PerfilComponent),
    canActivate: [authGuard],
    children: [
      { path: 'mis-pedidos',
        loadComponent: () =>
          import('./pages/pedidos/pedidos.component/pedidos.component').then(m => m.PedidosComponent),
        canActivate: [authGuard]},

      { path: 'pedidos/:id',
        loadComponent: () =>
          import('./pages/pedidos/pedido-detalle.component/pedido-detalle.component').then(m => m.PedidoDetalleComponent),
        canActivate: [authGuard]},

      {path: 'direcciones',
        loadComponent: () =>
          import('./pages/perfil/perfil-direcciones.component/perfil-direcciones.component').then(m => m.PerfilDireccionesComponent),
        canActivate: [authGuard]},

      { path: 'mis-datos',
        loadComponent: () =>
          import('./pages/perfil/perfil-datos.component/perfil-datos.component').then(m => m.PerfilDatosComponent),
        canActivate: [authGuard]},
    ]
  },

  { path: 'mis-pedidos',
    loadComponent: () =>
      import('./pages/pedidos/pedidos.component/pedidos.component').then(m => m.PedidosComponent),
    canActivate: [authGuard]},

  { path: 'pedidos/:id',
    loadComponent: () =>
      import('./pages/pedidos/pedido-detalle.component/pedido-detalle.component').then(m => m.PedidoDetalleComponent),
    canActivate: [authGuard]},

  { path: 'direcciones',
    loadComponent: () =>
      import('./pages/perfil/perfil-direcciones.component/perfil-direcciones.component').then(m => m.PerfilDireccionesComponent),
    canActivate: [authGuard]},

  { path: 'mis-datos',
    loadComponent: () =>
      import('./pages/perfil/perfil-datos.component/perfil-datos.component').then(m => m.PerfilDatosComponent),
    canActivate: [authGuard]},

  { path: 'prueba',
    component: PruebaComponent,
    canActivate: [authGuard]},

  { path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard],
    data: {roles: ['ADMIN']}},

  { path: 'productos/nuevo',
    component: ProductoForm,
    canActivate: [roleGuard],
    data: {roles: ['ADMIN']}},

  { path: 'productos/editar/:id',
    component: ProductoForm,
    canActivate: [roleGuard],
    data: {roles: ['ADMIN']}},

  { path: '**',
    redirectTo: 'productos'}

  ];
  //{ path: 'productos/nuevo', component: ProductoForm, canActivate: [authGuard], data: { role: 'ADMIN' }},
