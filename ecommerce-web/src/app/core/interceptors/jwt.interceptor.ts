// jwt.interceptor.ts - Versión simplificada y funcional
import { inject } from "@angular/core";
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from "../../auth/auth.service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener el token actual
  const token = authService.getToken();

  // Definir endpoints que son completamente públicos
  // Estos NO requieren token bajo ninguna circunstancia
  const publicEndpoints = [
    '/auth/login',
    '/auth/register',
    '/api/productos',
    '/api/categorias'
  ];

  // Verificar si la URL actual es un endpoint público
  const isPublic = publicEndpoints.some(endpoint => req.url.includes(endpoint));

  // Si NO es público y tenemos token válido, añadirlo
  if (!isPublic && token && authService.isTokenValid()) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // Si NO es público y el token existe pero está expirado
  if (!isPublic && token && !authService.isTokenValid()) {
    // Solo hacer logout si realmente es necesario (no para endpoints públicos)
    authService.logout();
    router.navigate(['/login']);
    return throwError(() => new Error('Token expirado, por favor inicie sesión nuevamente'));
  }

  // Para todos los demás casos (públicos o sin token), continuar normalmente
  return next(req);
};

/* import { inject } from "@angular/core";
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from "../../auth/auth.service";
import { Router } from "@angular/router";
import { captureError } from "rxjs/internal/util/errorContext";
import { catchError, throwError } from "rxjs";

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();


  const publicEndpoints = [
    '/api/productos',
    '/api/categorias',
    '/api/productos/buscar',
    '/auth/login',
    '/auth/register'
  ];

  const isPublicEndpoint = publicEndpoints.some(endpoint =>
    req.url.includes(endpoint)
  );

  if (isPublicEndpoint && token && authService.isTokenExpired()) {
    return next(req);
  }

  if (!isPublicEndpoint && token && authService.isTokenExpired()) {
    authService.logout();
    router.navigate(['/login']);
    return throwError(() => new Error('Token expirado'));
  }


  if (token && !authService.isTokenExpired()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {

      //Backend devuelve 401 o 403
      if ((error.status === 401 || error.status === 403) && !isPublicEndpoint) {
        authService.logout();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );

}; */

