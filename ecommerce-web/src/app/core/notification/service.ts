import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  message: string;
  type: NotificationType;
  duration?: number;        // Duración personalizada
  dismissible?: boolean;    // Si se puede cerrar manualmente
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private notificationsSubject = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notificationsSubject.asObservable();

  // Para múltiples notificaciones (opcional)
  private queue: Notification[] = [];
  private showing = false;

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, duration: number = 3000): void {
    this.show({ message, type: 'success', duration, dismissible: true });
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, duration: number = 4000): void {
    this.show({ message, type: 'error', duration, dismissible: true });
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, duration: number = 3000): void {
    this.show({ message, type: 'info', duration, dismissible: true });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, duration: number = 3500): void {
    this.show({ message, type: 'warning', duration, dismissible: true });
  }

  /**
   * Muestra una notificación personalizada
   */
  show(notification: Notification): void {
    // Si ya hay una notificación mostrándose, encolamos
    if (this.showing) {
      this.queue.push(notification);
      return;
    }

    this.showing = true;
    this.notificationsSubject.next(notification);

    // Auto-clear después de la duración
    setTimeout(() => {
      this.clear();

      // Mostrar siguiente en cola si existe
      setTimeout(() => {
        this.showing = false;
        if (this.queue.length > 0) {
          const next = this.queue.shift();
          if (next) this.show(next);
        }
      }, 300);
    }, notification.duration || 3000);
  }

  /**
   * Limpia la notificación actual
   */
  clear(): void {
    this.notificationsSubject.next(null);
  }

  /**
   * Limpia todas las notificaciones (incluyendo cola)
   */
  clearAll(): void {
    this.queue = [];
    this.clear();
  }
}
