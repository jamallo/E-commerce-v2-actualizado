import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmacionConfig {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
}

export interface ConfirmacionInterna extends ConfirmacionConfig {
  responder: (resultado: boolean) => void;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmacionService {

  private confirmacionSubject = new Subject<ConfirmacionInterna>();

  confirmaciones$ = this.confirmacionSubject.asObservable();

  confirmar(config: ConfirmacionConfig): Observable<boolean> {
    return new Observable(observer => {
      this.confirmacionSubject.next({
        ...config,
        responder: (resultado: boolean) => {
          observer.next(resultado);
          observer.complete();
        }
      });
    });
  };
}
