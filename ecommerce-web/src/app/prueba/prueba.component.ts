import { Component } from "@angular/core";
import { PruebaService } from "./prueba.service";
import { CommonModule } from "@angular/common";

@Component ({
  selector: 'app-prueba',
  standalone: true,
  //template: `<button (click) = "probar()">Probar endpoint protegido</button>`,
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css'],
  imports: [CommonModule]
})

export class PruebaComponent {

  mensaje = '';
  error = '';

  constructor(private pruebaService: PruebaService) {}

  probar(): void {
    this.pruebaService.acceder().subscribe({
      next: (res) => {
        this.mensaje = res;
        this.error = '';
      },
      error: () => {
        this.error = 'No tienes permiso para acceder';
        this.mensaje = '';
      }
    });
  }
}
