import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../notification/service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const notification = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(err => {

      if (err.status === 401) {
        authService.logout();
        notification.error('Sesión expirada');
        router.navigate(['/login']);
      }

      if (err.status === 403) {
        notification.error('No tienes permisos para esta acción');
      }

      if (err.status >= 500) {
        notification.error('Error interno del servidor');
      }

      return throwError(() => err);
    })
  );
};
