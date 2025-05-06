import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const pass = environment.authTokenPass;
    const key = CryptoJS.enc.Base64.parse(environment.authTokenKey);
    const iv = CryptoJS.enc.Utf8.parse(environment.authTokenIv);

    const encryptedToken = CryptoJS.AES.encrypt(pass, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
    }).toString();

    return new HttpHeaders({
      Authorization: `Bearer ${encryptedToken}`,
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${endpoint}`, {
      headers: this.getAuthHeaders(),
    });
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
