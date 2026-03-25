import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  roles?: string[];
  exp: number;
}

// Interfaz para login
export interface LoginRequest {
  email: string;
  contrasenia: string;
}

// Interfaz para registro (solo email y contraseña)
export interface RegistroRequest {
  email: string;
  contrasenia: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:8081/auth';

  constructor(private http: HttpClient) {}

  login(email: string, contrasenia: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { email, contrasenia };

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  registro(email: string, contrasenia: string): Observable<string> {
    const registroData: RegistroRequest = { email, contrasenia };


    return this.http.post<string>(`${this.API_URL}/register`, registroData, {
      responseType: 'text' as 'json'
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  private decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  getEmail(): string | null {
    return this.decodeToken()?.sub ?? null;
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  isTokenExpired(): boolean {
    return !this.isTokenValid();
  }

  isLogged(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  getUserRole(): string | null {
    return this.decodeToken()?.roles?.[0] ?? null;
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles ?? [];
    } catch {
      return [];
    }
  }

  isAdmin(): boolean {
    return this.getRoles().includes('ADMIN');
  }

  isUser(): boolean {
    return this.getRoles().includes('USER');
  }
}
