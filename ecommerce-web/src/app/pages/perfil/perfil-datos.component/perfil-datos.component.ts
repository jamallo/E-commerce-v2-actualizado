import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

// Servicios
import { DireccionService } from '../perfil-direcciones/direccion.service';
import { Direccion } from '../../../shared/direccion/direccion.model';

interface PerfilData {
  email: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
}

@Component({
  selector: 'app-perfil-datos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Material Modules
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  templateUrl: './perfil-datos.component.html',
  styleUrls: ['./perfil-datos.component.scss']
})
export class PerfilDatosComponent implements OnInit, OnDestroy {

  perfilData: PerfilData = {
    email: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    provincia: ''
  };

  direccionPrincipal: Direccion | null = null;
  tieneDireccionPrincipal = false;

  // Formularios
  datosForm: FormGroup;
  passwordForm: FormGroup;

  // Estados
  editMode = false;
  loading = true;
  saving = false;
  showPasswordForm = false;

  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private direccionService: DireccionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // Inicializar formulario de datos personales
    this.datosForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9+ ]{9,15}$')]],
      direccion: [''],
      ciudad: [''],
      codigoPostal: ['', [Validators.pattern('^[0-9]{5}$')]],
      provincia: ['']
    });

    // Inicializar formulario de cambio de contraseña
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.cargarDatosPerfil();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarDatosPerfil(): void {
    this.loading = true;

    // Obtener email del token
    const email = this.authService.getEmail();
    this.perfilData.email = email || '';

    // Cargar direcciones para obtener la principal
    const sub = this.direccionService.obtener().subscribe({
      next: (direcciones) => {
        // Buscar dirección principal
        this.direccionPrincipal = direcciones.find(d => d.principal) || null;
        this.tieneDireccionPrincipal = !!this.direccionPrincipal;

        if (this.direccionPrincipal) {
          // Actualizar perfilData con la dirección principal
          this.perfilData = {
            ...this.perfilData,
            nombre: this.direccionPrincipal.nombre || '',
            apellidos: this.direccionPrincipal.apellidos || '',
            telefono: this.direccionPrincipal.telefono || '',
            direccion: this.direccionPrincipal.direccion || '',
            ciudad: this.direccionPrincipal.ciudad || '',
            codigoPostal: this.direccionPrincipal.codigoPostal || '',
            provincia: this.direccionPrincipal.provincia || ''
          };
        }

        // Actualizar formulario con los datos
        this.actualizarFormulario();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar direcciones:', error);
        this.loading = false;
        this.mostrarNotificacion('Error al cargar los datos del perfil', 'error');
      }
    });

    this.subscription.add(sub);
  }

  actualizarFormulario(): void {
    this.datosForm.patchValue({
      nombre: this.perfilData.nombre,
      apellidos: this.perfilData.apellidos,
      email: this.perfilData.email,
      telefono: this.perfilData.telefono,
      direccion: this.perfilData.direccion,
      ciudad: this.perfilData.ciudad,
      codigoPostal: this.perfilData.codigoPostal,
      provincia: this.perfilData.provincia
    });
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // Activar modo edición
  activarEdicion(): void {
    if (this.tieneDireccionPrincipal) {
      this.editMode = true;
    } else {
      this.mostrarNotificacion('Necesitas tener una dirección principal para editar el perfil', 'error');
      // Opcional: redirigir a la página de direcciones
    }
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.editMode = false;
    // Restaurar valores originales
    this.actualizarFormulario();
  }

  // Guardar cambios
  guardarCambios(): void {
    if (!this.direccionPrincipal?.id) {
      this.mostrarNotificacion('No hay dirección principal para actualizar', 'error');
      return;
    }

    if (this.datosForm.valid) {
      this.saving = true;

      // Actualizar la dirección principal con los nuevos datos
      const direccionActualizada: Direccion = {
        id: this.direccionPrincipal.id,
        nombre: this.datosForm.get('nombre')?.value,
        apellidos: this.datosForm.get('apellidos')?.value,
        telefono: this.datosForm.get('telefono')?.value,
        direccion: this.datosForm.get('direccion')?.value,
        ciudad: this.datosForm.get('ciudad')?.value,
        codigoPostal: this.datosForm.get('codigoPostal')?.value,
        provincia: this.datosForm.get('provincia')?.value,
        principal: true
      };

      const sub = this.direccionService.actualizar(this.direccionPrincipal.id, direccionActualizada).subscribe({
        next: () => {
          // Actualizar datos locales
          this.perfilData = {
            ...this.perfilData,
            nombre: direccionActualizada.nombre,
            apellidos: direccionActualizada.apellidos,
            telefono: direccionActualizada.telefono,
            direccion: direccionActualizada.direccion,
            ciudad: direccionActualizada.ciudad,
            codigoPostal: direccionActualizada.codigoPostal,
            provincia: direccionActualizada.provincia
          };

          this.editMode = false;
          this.saving = false;

          this.mostrarNotificacion('Datos actualizados correctamente', 'success');
        },
        error: (error) => {
          console.error('Error al actualizar dirección:', error);
          this.saving = false;
          this.mostrarNotificacion('Error al actualizar los datos', 'error');
        }
      });

      this.subscription.add(sub);
    } else {
      this.marcarCamposInvalidos(this.datosForm);
      this.mostrarNotificacion('Por favor, corrige los errores en el formulario', 'error');
    }
  }

  // Cambiar contraseña
  cambiarPassword(): void {
    if (this.passwordForm.valid) {
      this.saving = true;

      // Aquí iría la llamada al endpoint de cambio de contraseña
      // Por ahora simulamos el éxito
      setTimeout(() => {
        this.passwordForm.reset();
        this.showPasswordForm = false;
        this.saving = false;

        this.mostrarNotificacion('Contraseña cambiada correctamente', 'success');
      }, 1500);
    } else {
      if (this.passwordForm.hasError('passwordMismatch')) {
        this.mostrarNotificacion('Las contraseñas no coinciden', 'error');
      } else {
        this.marcarCamposInvalidos(this.passwordForm);
        this.mostrarNotificacion('Por favor, completa todos los campos', 'error');
      }
    }
  }

  // Marcar campos inválidos
  marcarCamposInvalidos(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  // Mostrar notificación
  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout();
    // Redirigir al login (esto debería manejarlo el componente padre)
  }

  // Getters seguros para el template
  get nombreControl(): AbstractControl | null {
    return this.datosForm.get('nombre');
  }

  get apellidosControl(): AbstractControl | null {
    return this.datosForm.get('apellidos');
  }

  get telefonoControl(): AbstractControl | null {
    return this.datosForm.get('telefono');
  }

  get codigoPostalControl(): AbstractControl | null {
    return this.datosForm.get('codigoPostal');
  }

  get newPasswordControl(): AbstractControl | null {
    return this.passwordForm.get('newPassword');
  }

  get confirmPasswordControl(): AbstractControl | null {
    return this.passwordForm.get('confirmPassword');
  }

  get currentPasswordControl(): AbstractControl | null {
    return this.passwordForm.get('currentPassword');
  }

  // Método para obtener iniciales del usuario
  getUserInitials(): string {
    if (this.perfilData.nombre && this.perfilData.apellidos) {
      return (this.perfilData.nombre.charAt(0) + this.perfilData.apellidos.charAt(0)).toUpperCase();
    }
    return this.perfilData.email?.charAt(0).toUpperCase() || 'U';
  }

  // Verificar si el formulario de contraseña tiene error de coincidencia
  get passwordMismatch(): boolean {
    return this.passwordForm.hasError('passwordMismatch') &&
           this.passwordForm.get('confirmPassword')?.touched === true;
  }

  // Verificar si la nueva contraseña tiene la longitud mínima
  get isNewPasswordValidLength(): boolean {
    const newPassword = this.newPasswordControl?.value;
    return newPassword && newPassword.length >= 6;
  }

  // Mensaje para cuando no hay dirección principal
  get noDireccionPrincipalMessage(): string {
    return 'No tienes una dirección principal configurada. Ve a "Mis direcciones" para configurarla.';
  }
}
