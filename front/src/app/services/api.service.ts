import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  storeToken(token: string): void {
    localStorage.setItem('TOKEN_KEY', token);
  }
  getToken(): string | null {
    return localStorage.getItem('TOKEN_KEY');
  }

  private getTokenKey(): string {
    const token = this.getToken();
    if (token) {
      return token;
    } else {
      const newToken = this.auth.generateEncryptedToken();
      this.storeToken(newToken);
      return newToken;
    }
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getTokenKey()}`,
    });
  }

  get<T>(endpoint: string, options?: { [key: string]: any }): Observable<T> {
    const httpOptions = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    return this.http.get<T>(`${environment.apiUrl}${endpoint}`, httpOptions);
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${endpoint}`, body, {
      headers: this.getAuthHeaders(),
    });
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${endpoint}`, body, {
      headers: this.getAuthHeaders(),
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${endpoint}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
