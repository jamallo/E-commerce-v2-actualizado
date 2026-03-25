import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../service/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Producto } from '../producto.model';

@Component({
  selector: 'app-producto-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm implements OnInit{

  form!: FormGroup;

  cargando = false;
  error = '';
  mensaje = '';

  idProducto?: number;
  modoEdicion = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      activo: [true],
      imagenUrl: ['']
    });
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.idProducto = +id;
      this.modoEdicion = true;
      this.cargarProductos();
    }
    this.mensaje = '';
    this.error = '';
  }

  cargarProductos(): void {
    if (!this.idProducto) return;

    this.productoService.obtenerPorId(this.idProducto).subscribe({
      next: (producto) => {
        this.form.patchValue(producto);
      },
      error: (err) => {
        console.error('Error cargando producto', err);
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) return;

    this.cargando = true;
    this.error = '';

    const producto = this.form.value;

    const peticion$ = this.modoEdicion && this.idProducto
    ? this.productoService.actualizar(this.idProducto, producto)
    : this.productoService.crear(producto);

    peticion$.subscribe({
      next: (productoGuardado: Producto) => {
        if (this.imagenSeleccionada && productoGuardado.id) {
          this.productoService
          .subirImagen(productoGuardado.id, this.imagenSeleccionada)
          .subscribe();
        }
        this.cargando = false;
        this.mensaje = this.modoEdicion
        ? 'Producto actualizado correctamente'
        : 'Producto creado correctamente';

        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 800);
      },
      error: (err) => {
        this.cargando = false;
        this.error = 'Error al guardar el producto';
        console.error(err);
      }
    });
  }

  imagenSeleccionada?: File;

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    }
  }
}
