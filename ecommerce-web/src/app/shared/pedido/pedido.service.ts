//import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DireccionEnvio, PedidoDetalle, PedidoHistoriaDTO, PedidoRepetirItem } from './pedido.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {

  private apiUrl = 'http://localhost:8081/api/pedidos';

  constructor(private http: HttpClient) {}

  checkout(dto: DireccionEnvio) {
    return this.http.post(`${this.apiUrl}/checkout`, dto);
  }

  getMisPedidos() {
    return this.http.get<PedidoHistoriaDTO[]>(
      'http://localhost:8081/api/pedidos/mis-pedidos'
    );
  }

  obtenerDetalle(id: number) {
    return this.http.get<PedidoDetalle>(`${this.apiUrl}/${id}`);
  }

  repetirPedido(id: number) {
    return this.http.post<PedidoRepetirItem[]>(
      `${this.apiUrl}/${id}/repetir`,
      {}
    );
  }

}
