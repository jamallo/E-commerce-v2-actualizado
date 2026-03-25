import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagoResponseModel } from '../../shared/pago/pago-response.model';

@Injectable({
  providedIn: 'root',
})
export class PagoService {

  private apiUrl = 'http://localhost:8081/api/pago';

  constructor(private http: HttpClient){}

  crearPaymentIntent(): Observable<PagoResponseModel> {
    return this.http.post<PagoResponseModel>(
      `${this.apiUrl}/crear-payment-intent`,
      {}
    );
  }

}
