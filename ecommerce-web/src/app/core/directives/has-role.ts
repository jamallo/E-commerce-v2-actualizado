import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {

  private authService = inject(AuthService);

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input()
  set appHasRole(rolesPermitidos: string[]){
    this.viewContainer.clear();

    const rolesUsuario: string[] = this.authService.getRoles();

    const autorizado = rolesPermitidos.some(rol =>
      rolesUsuario.includes(rol)
    );

    if(autorizado) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
