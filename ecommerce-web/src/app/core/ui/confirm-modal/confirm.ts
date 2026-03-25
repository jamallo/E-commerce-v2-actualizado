import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root',
})

export class ConfirmService {

  private confirmSubject = new Subject<{
    options: ConfirmOptions;
    response: Subject<boolean>;
  }>();

  confirm$ = this.confirmSubject.asObservable();

  confirm(options: ConfirmOptions) {
    const response = new Subject<boolean>();
    this.confirmSubject.next({ options, response });
    return response.asObservable();
  }

}
