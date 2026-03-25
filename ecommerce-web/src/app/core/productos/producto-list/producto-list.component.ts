import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from "@angular/core";
import { Producto } from "../producto.model";
import { ProductoService } from "../../service/producto.service";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";
import { finalize, takeUntil } from "rxjs";
import { NotificationService } from "../../notification/service";
import { ConfirmService } from "../../ui/confirm-modal/confirm";
import { HasRoleDirective } from "../../directives/has-role";
import { TarjetaProductoComponent } from "../tarjeta-producto/tarjeta-producto";
import { Subject, debounceTime } from "rxjs";
import { TruncatePipe } from "./truncate.pipe";


@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HasRoleDirective, TarjetaProductoComponent, TruncatePipe],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss']
})

export class ProductoListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('sentinelaScroll', {static: false}) sentinelaScroll!: ElementRef;


  productos: Producto[] = [];
  cargando = false;



  //Variables de ordenación
  totalPaginas = 0;
  totalElementos = 0;
  paginaActual= 0;
  tamanioPaginas = 10;

  mensaje = '';
  //error = '';


  filtros = {
    nombre: '',
    activo: undefined as boolean | undefined,
    precioMin: undefined as number | undefined,
    precioMax: undefined as number | undefined,
  };
  sortBy = "id";
  direccion = 'ASC';
  hayMasProductos = true;
  filtrosCollapsed = true;

  /* productoAEliminar ?: number | null = null;
  mostrarConfirmacion = false;
  eliminando = false; */

  private filtrosSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private productoService: ProductoService,
    //private authService: AuthService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService
    //private cdr: ChangeDetectorRef
    )
    {}

  /* get esAdmin(): boolean {
    return this.authService.isAdmin();
  } */


  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    console.log('URL base del servidor', this.productoService['API_URL']);
    this.cargarProdutos();

    this.filtrosSubject
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.aplicarFiltros();
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFiltroChange(): void {
    this.filtrosSubject.next();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
    if(!this.sentinelaScroll) {
      console.warn('Sentinela scroll no encontrado');
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (
        entries[0].isIntersecting &&
        !this.cargando &&
        this.hayMasProductos
      ) {
          console.log('Sentinela detectado, cargando más productos...');
          this.paginaActual++;
          this.cargarProdutos();
        }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    observer.observe(this.sentinelaScroll.nativeElement);
  }, 500);
}

  cargarMasProductos(): void {
    if (this.cargando || !this.hayMasProductos) {
      return;
    }
    this.paginaActual++;
    this.cargarProdutos();
  }

  paginaSiguiente(): void {
    if(this.paginaActual < this.totalPaginas -1) {
      this.paginaActual++;
      this.cargarProdutos();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.cargarProdutos();
    }
  }

  aplicarFiltros(): void {
    this.paginaActual = 0;
    this.productos = [];
    this.hayMasProductos = true;

    const filtrosLimpios = {
      nombre: this.filtros.nombre?.trim() || undefined,
      activo: this.filtros.activo,
      precioMin: this.filtros.precioMin && this.filtros.precioMin > 0
        ? this.filtros.precioMin
        : undefined,
      precioMax: this.filtros.precioMax && this.filtros.precioMax > 0
        ? this.filtros.precioMax
        : undefined
    };

    if (filtrosLimpios.nombre === '') {
      filtrosLimpios.nombre = undefined;
    }

    this.cargarProductosConFiltros(filtrosLimpios);
  }

  private cargarProductosConFiltros(filtros: any): void {
    if (this.cargando) return;

    this.cargando = true;

    console.log('Cargando con filtros: ', {
      pagina: this.paginaActual,
      filtros: filtros,
      sortBy: this.sortBy,
      direccion: this.direccion
    });

    this.productoService
      .listarPaginado(
        this.paginaActual,
        this.tamanioPaginas,
        filtros,
        this.sortBy,
        this.direccion
      ).pipe(
        finalize(() => {
          this.cargando = false;
        })
      ).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor: ', response);

          if (this.paginaActual === 0) {
            this.productos = response.contenido || [];
          } else {
            this.productos = [...this.productos, ...(response.contenido || [])];
          }

          this.totalPaginas = response.totalPaginas || 0;
          this.totalElementos = response.totalElementos || 0;
          this.tamanioPaginas = response.tamanioPaginas || this.tamanioPaginas;
          this.paginaActual = response.paginaActual || this.paginaActual;

          this.hayMasProductos =
            response.contenido &&
            response.contenido.length > 0 &&
            this.paginaActual < this.totalPaginas -1;

          console.log('Estado actual: ', {
            productos: this.productos.length,
            totalPaginas: this.totalPaginas,
            paginaActual: this.paginaActual,
            hayMasProductos: this.hayMasProductos
          });
        },
        error: (err) => {
          console.error('ERROR cargando productos: ', err);
          console.error('Detalles del error: ', err.error);
          this.hayMasProductos = false;
        }
      });
  }

  private filtrosIniciales() {
    return {
      nombre: '',
      activo: undefined,
      precioMin: undefined,
      precioMax: undefined
    };
  }

  limpiarFiltros(): void {
    this.filtros = this.filtrosIniciales();
    this.sortBy = 'id';
    this.direccion = 'ASC';
    this.paginaActual = 0;
    this.productos = [];
    this.hayMasProductos = true;
    this.cargarProdutos();
  }

  cargarProdutos(): void {
    if(this.cargando) return;
    this.cargando = true;
    //this.error = '';

    this.productoService
    .listarPaginado(
      this.paginaActual,
      this.tamanioPaginas,
      this.filtros,
      this.sortBy,
      this.direccion
      )
      .pipe(
        finalize(() => {
        this.cargando = false;
        //this.cdr.detectChanges();
      }))
          .subscribe({
          next: (response) => {
            console.log('Productos recibidos: ', response);
            console.log('Filtros aplicados: ', this.filtros);

            if (this.paginaActual === 0) {
              this.productos = response.contenido;
            } else {
              this.productos = [...this.productos, ...response.contenido];
            }

            this.totalPaginas = response.totalPaginas || 0;
            this.totalElementos = response.totalElementos || 0;
            this.tamanioPaginas = response.tamanioPaginas || 10;
            this.paginaActual = response.paginaActual || 0;
            this.hayMasProductos =
              response.contenido && response.contenido.length > 0 &&
              (this.paginaActual +1) < this.totalPaginas;
            console.log('Estado despues de carga: ', {
              producto:this.productos.length,
              totalPaginas: this.totalPaginas,
              paginaActual: this.paginaActual,
              hayMasProductos: this.hayMasProductos
            });
      },
      error: (err) => {
        console.error('ERROR cargando productos: ', err);
        //this.error = 'Error cargando productos';
        this.hayMasProductos = false;
      }
    });
  }



  /* pedirConfirmacion(id: number): void{
    this.productoAEliminar = id;
    this.mostrarConfirmacion = true;
  } */

  pedirConfirmacion(id: number): void {
    this.confirmService.confirm({
      title: 'Eliminar producto',
      message: '¿Seguro que deseas eliminar este producto?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).subscribe(confirmado => {
      if (confirmado) {
        this.eliminarProducto(id);
      }
    });
  }

  eliminarProducto(id: number): void {
    this.productoService.eliminar(id).subscribe({
      next: () => this.notificationService.success('Producto eliminado'),
      error: () => this.notificationService.error('Error al eliminar')
    });
  }

  /* cancelarEliminar(): void {
    this.productoAEliminar = null;
    this.mostrarConfirmacion = false;
    this.eliminando = false;
  } */

   /* eliminarConfirmado() {
    if (!this.productoAEliminar) return;

    const id = this.productoAEliminar;

    this.eliminando = true;

    this.productoService.eliminar(id)
    .pipe(
      finalize(() => {
        this.eliminando = false;
        this.mostrarConfirmacion = false;
        this.productoAEliminar = null;
        this.cargarProdutos();
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: () => {
        this.notificationService.success('Producto eliminado correctamente');
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Error al eliminar el producto')
      }
    });
  } */

  trackById(index: number, producto: Producto): number {
    return producto.id;
  }

}


        /* eliminar(id: number): void {

          this.productoService.eliminar(id).subscribe({
            next: () => {
              this.mensaje = 'Producto eliminado correctamente';
              this.cargarProdutos();
              setTimeout(() => this.mensaje = '', 3000);
            },
            error: err => {
              this.error = 'Error al eliminar el producto';
              console.error(err);
            }
          });
        } */
