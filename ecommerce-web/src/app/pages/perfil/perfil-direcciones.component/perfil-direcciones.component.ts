import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DireccionService } from '../perfil-direcciones/direccion.service';
import { Direccion } from '../../../shared/direccion/direccion.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-direcciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-direcciones.component.html',
  styleUrl: './perfil-direcciones.component.css',
})
export class PerfilDireccionesComponent implements OnInit{

  direcciones: Direccion[] = [];
  direccionesEditando: Direccion | null = null;
  mostrarFormulario = false;

  constructor (private service: DireccionService) {}

  ngOnInit(): void {
    this.service.obtener().subscribe(d => this.direcciones = d);
  }

  eliminar(id: number) {
    this.service.eliminar(id).subscribe(() => {
      this.cargar();
    });
  }

  principal(id: number) {
    this.service.marcarPrincipal(id).subscribe(() => {
      this.cargar();
    });
  }

  cargar() {
    this.service.obtener().subscribe(direccion => this.direcciones = direccion);
  }

  nueva() {
    this.direccionesEditando = {
      nombre: '',
      apellidos: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      provincia: '',
      telefono: '',
      principal: false
    };
    this.mostrarFormulario = true;
  }

  editar(direccion: Direccion) {
    this.direccionesEditando = {...direccion};
    this.mostrarFormulario = true;
  }

  guardar() {
    if (!this.direccionesEditando) return;

    if (this.direccionesEditando.id) {
      this.service.actualizar(
        this.direccionesEditando.id,
        this.direccionesEditando
      ).subscribe(() => {
        this.cargar();
        this.cerrarFormulario();
      });
    } else {
      this.service.guardar(this.direccionesEditando).subscribe(() => {
        this.cargar();
        this.cerrarFormulario();
      })
    }
  }

  cancelar() {
    this.cerrarFormulario();
  }

  cerrarFormulario() {
    this.direccionesEditando = null;
    this.mostrarFormulario = false;
  }

}
