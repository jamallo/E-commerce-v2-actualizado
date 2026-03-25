import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";


export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);


    if (authService.isLogged()){
      return true;
    }

    // Si no está autenticado -> Login
    router.navigate(['/login'], {
      queryParams: {redirect: '/checkout'}
    });
    
    return false;

};
