import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Producto } from "../productos/producto.model";
import { PaginaResponseDTO } from "./pagina-response.dto";


@Injectable({
  providedIn: 'root'
})

export class ProductoService {

  private API_URL = 'http://localhost:8081/api/productos';

  constructor(private http: HttpClient) {}

  crear(producto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(`${this.API_URL}`, producto);
  }

  obtenerPorId(id: number) : Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/${id}`);
  }

  actualizar(id: number, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.API_URL}/${id}`, producto);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  listarPaginado(
    page: number = 0,
    size: number = 10,
    filtros?: {
      nombre?: string;
      activo?: boolean;
      precioMin?: number;
      precioMax?: number;
    },
    sortBy: string = 'id',
    direccion: string = 'ASC'
  ){
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direccion', direccion);

    console.log('Filtros enviados: ', filtros);

    if (filtros?.nombre && filtros.nombre.trim() !== '') {
      params = params.set('nombre', filtros.nombre.trim());
    }

    if (filtros?.activo !== undefined && filtros.activo !== null) {
      params = params.set('activo', filtros.activo.toString());
    }

    if (filtros?.precioMin !== undefined && filtros.precioMin !== null && filtros.precioMin >0) {
      params = params.set('precioMin', filtros.precioMin.toString());
    }

    if (filtros?.precioMax !== undefined && filtros.precioMax !== null && filtros.precioMax > 0) {
      params = params.set('precioMax', filtros.precioMax.toString());
    }

    console.log('URL: ', this.API_URL);
    console.log('Params: ', params.toString());

    return this.http.get<PaginaResponseDTO<Producto>>(
      this.API_URL, { params }
    );

  }

  subirImagen(id: number, archivo: File) {
    const formData = new FormData();
    formData.append('imagen', archivo);

    return this.http.post(`${this.API_URL}/{id}/imagen`, formData);
  }
}
