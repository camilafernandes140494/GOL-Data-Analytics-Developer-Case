import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private apiService: ApiService) {}

  // Botão	Cadastrar uma reserva	POST /api/v1/booking
  // Botão	Download das reservas	GET /api/v1/booking/file/download
  // Botão	Upload das reservas	POST /api/v1/booking/file/upload
  // Tabela	Reservas	GET /api/v1/booking

  getBookings() {
    return this.apiService.get('/api/v1/booking');
  }

  createBooking(bookingData: any) {
    return this.apiService.post('/api/v1/booking', bookingData);
  }

  uploadBookings(file: FormData) {
    return this.apiService.post('/api/v1/booking/file/upload', file);
  }

  downloadBookings() {
    return this.apiService.get('/api/v1/booking/file/download');
  }
}
