import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BasketItem } from '../../shared/basket/basket.model';
import { BasketService } from '../../shared/basket/basket';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PedidoService } from '../../shared/pedido/pedido.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { Direccion } from '../../shared/direccion/direccion.model';
import { DireccionService } from '../perfil/perfil-direcciones/direccion.service';
import { of, map, Observable, startWith } from 'rxjs';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { PagoService } from '../../core/service/pago.service';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule} from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'


type CheckoutStep = 'direccion' | 'confirmacion';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatFormField,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})



export class CheckoutComponent implements OnInit {

  provincias: string[] = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
    'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria',
    'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada',
    'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Illes Balears',
    'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lleida',
    'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense',
    'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife',
    'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo',
    'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
  ];

  provinciasFiltradas!: Observable<string[]>;

  step: CheckoutStep = 'direccion';


  items: BasketItem[] = [];
  total = 0;
  animarTotal = false;

  formularioEnvio!: FormGroup;
  cargando = false;
  error ='';

  direccionConfirmada: any;
  direccionSeleccionadaId?: number | null = null;
  //guardarDireccionNueva = false;

  stripe!: Stripe;
  elements!: StripeElements;
  cardElement: any;



  constructor(
    private backetService: BasketService,
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private direccionService: DireccionService,
    private pagoService: PagoService,
    private router: Router,
    private spinner: SpinnerService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.backetService.items$.subscribe(items => {
      this.items = items;
      this.total = this.backetService.getTotal();
    });

    this.formularioEnvio = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      tipoVia: ['Calle', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      provincia: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      guardarDireccionNueva: [false],
    });

    this.direccionService.obtener().subscribe(d => {
      this.direcciones = d;

      const principal = d.find(d => d.principal);
      if (principal) {
        setTimeout(() => {
        this.usarDireccion(principal.id!);
        //this.direccionSeleccionadaId = principal.id!;
        //this.formularioEnvio.patchValue(principal);
        });
      }
    });

    this.provinciasFiltradas = this.formularioEnvio
      .get('provincia')!
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filtrarProvincias(value || ''))
      );
  }




  continuar(): void {
    if (this.formularioEnvio.invalid) {
      this.formularioEnvio.markAllAsTouched();
      return;
    }
    this.direccionConfirmada = {...this.formularioEnvio.value};
    this.step = 'confirmacion';

    this.inicializarStripe();
  }

  confirmarCompra(): void {
  console.log('Iniciando confirmarCompra');
  console.log('Token:', localStorage.getItem('token'));

  this.cargando = true;
  this.error = '';
  this.spinner.show();

  const formValue = this.formularioEnvio.value;

  const guardarDireccionNueva = formValue.guardarDireccionNueva;

  const direccionEnvio: Direccion = {
    nombre: formValue.nombre,
    apellidos: formValue.apellidos,
    direccion: formValue.direccion,
    ciudad: formValue.ciudad,
    codigoPostal: formValue.codigoPostal,
    provincia: formValue.provincia,
    telefono: formValue.telefono,
    principal: false
  };

  const guardarDireccion$ =
    guardarDireccionNueva && this.direccionSeleccionadaId === null
      ? this.direccionService.guardar(direccionEnvio).pipe(map(() => void 0))
      : of(void 0);

    guardarDireccion$.subscribe({
    next: () => {
      this.backetService.syncWithBackend().subscribe({
        next: () => {
          this.pedidoService.checkout(direccionEnvio).subscribe({
            next: () => {
              this.backetService.clear();
              this.spinner.hide();
              this.router.navigate(['/checkout/exito']);
            },
            error: () => {
              this.error = 'Error al procesar el pedido';
              this.cargando = false;
              this.spinner.hide();
            }
          });
        },
        error: () => {
          this.error = 'Error sincronizando la cesta';
          this.spinner.hide();
        }
      });
    },
    error: () => {
      this.error = 'Error al guardar la dirección';
      this.cargando = false;
      this.spinner.hide();
    }
  });
}

  direcciones: Direccion[] = [];

  usarDireccion(id: number | null) {
    if(id === null) {
      this.direccionSeleccionadaId = null;
      this.formularioEnvio.reset({guardarDireccionNueva: false});
      return;
    }
    const dir = this.direcciones.find(d => d.id === +id);
    if(dir) {
      this.direccionSeleccionadaId = dir.id!;
      this.formularioEnvio.patchValue({
        nombre: dir.nombre,
        apellidos: dir.apellidos,
        direccion: dir.direccion,
        ciudad: dir.ciudad,
        codigoPostal: dir.codigoPostal,
        provincia: dir.provincia,
        telefono: dir.telefono,
        guardarDireccionNueva: false
      });
      this.cdr.detectChanges();
    }
  }

  confirmarPago() {
    if (this.cestaVacia || this.cargando) return;
    console.log('Confirmar pago: llamando backend');
    this.cargando = true;
    this.error = '';
    //this.spinner.show();

    this.pagoService.crearPaymentIntent().subscribe({
      next: async (res) => {
        console.log('Respuesta backend: ', res);

        /* if (!res || !res?.clientSecret) {
          this.error = 'Error iniciando el pago';
          this.spinner.hide();
          console.error('clientSecret NO Recibido');
          return
        } */
      const result = await this.stripe.confirmCardPayment(
        res.clientSecret,
        {
          payment_method: {
            card: this.cardElement
          }
        }
      );

      console.log('Resultado Stripe:', result);

      if (result.error)  {
        console.error('Error en el pago: ', result.error.message);
        this.error = result.error.message || 'Error en el pago';
        this.cargando = false;
        //this.spinner.hide();
      } else if (result.paymentIntent?.status === 'succeeded') {
          console.log('Pago realizado correctamente');
          this.finalizarPedido();
          //this.router.navigate(['/checkout/exito']);
        }
      },
      error: err => {
        console.error('Error backend: ', err);
        this.error = 'Error conectando con el pago';
        this.cargando = false;
        //this.spinner.hide();
      }
    });
  }

  async inicializarStripe() {
    if (this.stripe) return;

    this.stripe = await loadStripe(
      'pk_test_51Spcg7BgJyR1F4c1nVXT7mqXGSISrxAvZFIf5NXwjFNd8ErbHh1pnsdM5qZ87ooMvGDGxlXQlj7U9iI03n0VQbTg00NZfFBkaS'
    ) as Stripe;

    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card');

    setTimeout(() => {
      this.cardElement.mount('#card-element');
    });
  }

  private filtrarProvincias(valor: string): string[] {
    if (!valor || valor.length < 2) {
      return [];
    }
    const filtro = valor.toLowerCase();
    return this.provincias.filter(p =>
      p.toLowerCase().includes(filtro)
    );
  }

  private finalizarPedido() {
    const formValue = this.formularioEnvio.value;

    const direccionEnvio: Direccion = {
      nombre: formValue.nombre,
      apellidos: formValue.apellidos,
      direccion: formValue.direccion,
      ciudad: formValue.ciudad,
      codigoPostal: formValue.codigoPostal,
      provincia: formValue.provincia,
      telefono: formValue.telefono,
      principal: false
    };

    const guardarDireccion$: Observable<void> =
    formValue.guardarDireccionNueva && this.direccionSeleccionadaId === null
    ? this.direccionService.guardar(direccionEnvio).pipe(map(() => void 0))
    : of(void 0);

    guardarDireccion$.subscribe({
      next: () => {
        this.backetService.syncWithBackend().subscribe({
          next: () => {
            this.pedidoService.checkout(direccionEnvio).subscribe({
              next: () => {
                this.backetService.clear();
                this.spinner.hide();
                this.router.navigate(['/checkout/exito']);
              },
              error: () => {
                this.error = 'Error creando el pedido';
              }
            });
          }
        });
      },
      error: () => {
        this.error = 'Error guardando la dirección';
        this.spinner.hide();
      }
    });
  }

  incrementar(item: BasketItem) {
    if (this.cargando) return;
    this.backetService.add(item.product);
    this.actualizarTotal();
    this.mostrarSnack(`Añadido ${item.product.nombre}`);
  }

  decrementar(item: BasketItem) {
    if (this.cargando) return;
    if (item.quantity > 1) {
      this.backetService.decrease(item.product.id);
      this.mostrarSnack(`Reducida la cantidad de ${item.product.nombre}`, 'warn');
    } else {
      this.backetService.remove(item.product.id);
      this.mostrarSnack(`${item.product.nombre} eliminado`, 'error');
    }
    this.actualizarTotal();
  }

  eliminar(item: BasketItem) {
    if (this.cargando) return;
    this.backetService.remove(item.product.id);
    this.actualizarTotal();
    this.mostrarSnack(`${item.product.nombre} eliminado del pedido`, 'error');
  }

  private ultimoTotal = 0;
  private actualizarTotal() {
    const nuevoTotal = this.backetService.getTotal();

    if (nuevoTotal === 0 && this.total !== 0) {
      this.mostrarSnack('La cesta está vacía', 'warn');
    }
    if (nuevoTotal !== this.ultimoTotal) {
      this.animarTotal = true;

      setTimeout(() => {
        this.animarTotal = false;
      }, 500);
    }

    this.total = nuevoTotal;
    this.ultimoTotal = nuevoTotal;
  }

  get cestaVacia(): boolean {
    return this.items.length === 0;
  }

  private mostrarSnack(
    mensaje: string,
    tipo: 'ok' | 'warn' | 'error' = 'ok'
  ) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snack-${tipo}`]
    });
  }
}



