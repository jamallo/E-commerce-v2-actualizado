import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input, HostBinding, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { NotificationService, Notification } from './service';
import { Subject, takeUntil } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  @Input() autoClose = true;
  @Input() autoCloseTime = 3000;

  notification: Notification | null = null;
  closing = false;
  isMobile = false;

  private destroy$ = new Subject<void>();
  private timeoutId: any;
  private touchStarted = false;

  @HostBinding('class.closing') get isClosing() { return this.closing; }

  constructor(
    private notificationService: NotificationService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Detectar si es móvil
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;

      // Escuchar cambios de tamaño
      window.addEventListener('resize', () => {
        this.isMobile = window.innerWidth <= 768;
      });
    }

    this.notificationService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        if (notification) {
          this.show(notification);
        } else {
          this.hide();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearTimer();
  }

  private show(notification: Notification): void {
    // Limpiar notificación anterior si existe
    if (this.notification) {
      this.closing = true;
      setTimeout(() => {
        this.notification = notification;
        this.closing = false;
        this.startAutoClose();
      }, 300);
    } else {
      this.notification = notification;
      this.closing = false;
      this.startAutoClose();
    }
  }

  private hide(): void {
    this.closing = true;
    setTimeout(() => {
      this.notification = null;
      this.closing = false;
      this.clearTimer();
    }, 300);
  }

  private startAutoClose(): void {
    if (this.autoClose) {
      this.startTimer();
    }
  }

  private startTimer(): void {
    this.clearTimer();

    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(() => {
          this.cerrar();
        });
      }, this.autoCloseTime);
    });
  }

  private clearTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  // Para desktop - mouse enter
  onMouseEnter(): void {
    if (!this.isMobile && this.autoClose) {
      this.clearTimer();
    }
  }

  // Para desktop - mouse leave
  onMouseLeave(): void {
    if (!this.isMobile && this.autoClose && this.notification) {
      this.startTimer();
    }
  }

  // Para móvil - touch start
  onTouchStart(): void {
    if (this.isMobile && this.autoClose) {
      this.touchStarted = true;
      this.clearTimer();
    }
  }

  // Para móvil - touch end
  onTouchEnd(): void {
    if (this.isMobile && this.autoClose && this.notification && this.touchStarted) {
      // Pequeño retraso para evitar cierres accidentales
      setTimeout(() => {
        if (!this.touchStarted) return;
        this.startTimer();
        this.touchStarted = false;
      }, 100);
    }
  }

  // Para móvil - touch cancel (si se desliza fuera)
  onTouchCancel(): void {
    if (this.isMobile) {
      this.touchStarted = false;
      if (this.autoClose && this.notification) {
        this.startTimer();
      }
    }
  }

  cerrar(): void {
    this.clearTimer();
    this.closing = true;
    setTimeout(() => {
      this.notificationService.clear();
    }, 300);
  }
}
