import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PruebaService {

  private API_URL = 'http://localhost:8081/api/prueba';
  private respuesta = 'text';

  constructor(private http: HttpClient) {}

    acceder(): Observable<any> {
      return this.http.get(this.API_URL, { responseType: 'text' });

  }
}
