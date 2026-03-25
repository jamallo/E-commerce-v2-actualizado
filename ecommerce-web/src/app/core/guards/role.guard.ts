import { ActivatedRouteSnapshot, CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { NotificationService } from "../notification/service";


export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

    const authService = inject(AuthService);
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    const rolesPermitidos: string[] = route.data['roles'];

    if (!authService.isLogged()) {
      notificationService.info('Debes iniciar sesión');
      router.navigate(['/login']);
      return false;
    }

    const rolesUsuario = authService.getRoles();

    const autorizado = rolesPermitidos.some(rol =>
      rolesUsuario.includes(rol)
    );

    if (!autorizado) {
      notificationService.error('No tienes permisos para acceder a esta sección');
      router.navigate(['/productos']);
      return false;
    }

    return true;
};
