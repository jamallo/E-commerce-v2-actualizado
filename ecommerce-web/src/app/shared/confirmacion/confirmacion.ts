import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmacionService } from './confirmacion.service';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacion.html',
  styleUrl: './confirmacion.css',
})
export class ConfirmacionComponent {

  visible = false;
  titulo = '';
  mensaje = '';
  textoConfirmar = 'Aceptar';
  textoCancelar = 'Cancelar';

  private responder!: (resultado: boolean) => void;

  constructor (private confirmService: ConfirmacionService) {
    this.confirmService.confirmaciones$.subscribe(config => {
      this.visible = true;
      this.titulo = config.titulo;
      this.mensaje = config.mensaje;
      this.textoConfirmar = config.textoConfirmar ?? 'Aceptar';
      this.textoCancelar = config.textoCancelar ?? 'Cancelar';
      this.responder = config.responder;
    });
  }

  confirmar(): void {
    this.visible = false;
    this.responder(true);
  }

  cancelar(): void {
    this.visible = false;
    this.responder(false);
  }
}
