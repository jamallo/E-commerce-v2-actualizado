import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  modo: 'login' | 'registro' = 'login';

  // Login
  email = '';
  contrasenia = '';
  error = '';

  // Registro
  registroData = {
    email: '',
    contrasenia: '',
    confirmarContrasenia: '',
    aceptaTerminos: false
  };

  errorRegistro = '';
  cargando = false;
  registroExitoso = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Cambia entre el modo login y registro
   */
  cambiarModo(modo: 'login' | 'registro'): void {
    this.modo = modo;
    this.error = '';
    this.errorRegistro = '';
    this.registroExitoso = false;
    this.cargando = false;

    // Limpiar formularios al cambiar
    if (modo === 'login') {
      this.email = '';
      this.contrasenia = '';
    } else {
      this.registroData = {
        email: '',
        contrasenia: '',
        confirmarContrasenia: '',
        aceptaTerminos: false
      };
    }
  }

  /**
   * Iniciar sesión
   */
  login(): void {
    // Validaciones básicas
    if (!this.email || !this.contrasenia) {
      this.error = 'Por favor, completa todos los campos';
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.error = 'Por favor, introduce un email válido';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.email, this.contrasenia)
      .subscribe({
        next: () => {
          const redirect = this.route.snapshot.queryParamMap.get('redirect');
          this.router.navigateByUrl(redirect ?? '/productos');
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          this.cargando = false;

          // Manejar errores según el código HTTP
          if (err.status === 401 || err.status === 404) {
            this.error = 'Email o contraseña incorrectos';
          } else if (err.status === 500) {
            this.error = 'Error del servidor. Inténtalo más tarde';
          } else if (err.error?.mensaje) {
            this.error = err.error.mensaje;
          } else {
            this.error = 'Error al conectar con el servidor';
          }

          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Registrar nuevo usuario
   */
  registro(): void {
    // Validaciones
    if (!this.registroData.email || !this.registroData.contrasenia) {
      this.errorRegistro = 'Por favor, completa todos los campos';
      return;
    }

    if (!this.validarEmail(this.registroData.email)) {
      this.errorRegistro = 'Por favor, introduce un email válido';
      return;
    }

    if (this.registroData.contrasenia.length < 6) {
      this.errorRegistro = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.registroData.contrasenia !== this.registroData.confirmarContrasenia) {
      this.errorRegistro = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.registroData.aceptaTerminos) {
      this.errorRegistro = 'Debes aceptar los términos y condiciones';
      return;
    }

    this.cargando = true;
    this.errorRegistro = '';

    this.authService.registro(this.registroData.email, this.registroData.contrasenia)
      .subscribe({
        next: (mensaje: string) => {
          console.log('Registro exitoso:', mensaje);

          // Mostrar mensaje de éxito
          this.registroExitoso = true;

          // Intentar login automático
          this.authService.login(this.registroData.email, this.registroData.contrasenia)
            .subscribe({
              next: () => {
                const redirect = this.route.snapshot.queryParamMap.get('redirect');
                this.router.navigateByUrl(redirect ?? '/productos');
              },
              error: () => {
                // Si falla el login automático, ir al login manual
                this.cambiarModo('login');
                this.email = this.registroData.email;
                this.cargando = false;
                this.error = 'Registro exitoso. Por favor, inicia sesión.';
                this.cdr.detectChanges();
              }
            });
        },
        error: (err: HttpErrorResponse) => {
          this.cargando = false;

          // Manejar errores específicos
          if (err.status === 500) {
            if (err.error?.includes('email ya está registrado')) {
              this.errorRegistro = 'Este email ya está registrado';
            } else {
              this.errorRegistro = 'Error en el servidor. Inténtalo más tarde';
            }
          } else if (err.status === 400) {
            this.errorRegistro = 'Datos de registro inválidos';
          } else if (err.error) {
            // Si el error es un string directamente
            this.errorRegistro = typeof err.error === 'string'
              ? err.error
              : 'Error al crear la cuenta';
          } else {
            this.errorRegistro = 'Error al conectar con el servidor';
          }

          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Valida formato de email
   */
  private validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  /**
   * Verifica si las contraseñas coinciden (para el template)
   */
  passwordsCoinciden(): boolean {
    return this.registroData.contrasenia === this.registroData.confirmarContrasenia;
  }

  /**
   * Verifica si el formulario de registro es válido (para el template)
   */
  registroFormValido(): boolean {
  // Asegurarnos de que todos los valores son booleanos explícitamente
  const emailValido = !!this.registroData.email && this.validarEmail(this.registroData.email);
  const contraseniaValida = !!this.registroData.contrasenia && this.registroData.contrasenia.length >= 6;
  const contraseniasCoinciden = !!this.registroData.contrasenia &&
                                !!this.registroData.confirmarContrasenia &&
                                this.registroData.contrasenia === this.registroData.confirmarContrasenia;
  const terminosAceptados = !!this.registroData.aceptaTerminos;

  // Retornar la combinación de todos los booleanos
  return emailValido && contraseniaValida && contraseniasCoinciden && terminosAceptados;
}
}
