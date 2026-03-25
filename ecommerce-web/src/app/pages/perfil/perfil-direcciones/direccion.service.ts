import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Direccion } from '../../../shared/direccion/direccion.model';

@Injectable({
  providedIn: 'root',
})
export class DireccionService {

  private api = "http://localhost:8081/api/direcciones";

  constructor(private http: HttpClient) {}

  obtener() {
    return this.http.get<Direccion[]>(this.api);
  }

  guardar(direccion: Direccion) {
    return this.http.post<Direccion>(this.api, direccion);
  }

  marcarPrincipal(id: number) {
    return this.http.post(
      `${this.api}/${id}/principal`,
      {}
    );
  }

  actualizar(id: number, direccion: Direccion) {
    return this.http.put<Direccion>(
      `${this.api}/${id}`,
      direccion
    );
  }

  eliminar(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

}
