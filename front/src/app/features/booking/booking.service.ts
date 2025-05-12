import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';

export interface Booking {
  first_name: string;
  last_name: string;
  birthday: string;
  document: string;
  departure_date: string;
  departure_iata: string;
  arrival_iata: string;
  arrival_date: string;
}

export interface BookingResponse {
  count: number;
  limit: number;
  data: Booking[];
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private apiService: ApiService) {}

  // Botão	Cadastrar uma reserva	POST /api/v1/booking
  // Botão	Download das reservas	GET /api/v1/booking/file/download
  // Botão	Upload das reservas	POST /api/v1/booking/file/upload
  // Tabela	Reservas	GET /api/v1/booking

  getBookings(params: Pick<BookingResponse, 'limit'>) {
    return this.apiService.get<BookingResponse>(`/api/v1/booking?limit=${params.limit}`);
  }

  createBooking(bookingData: Booking) {
    return this.apiService.post('/api/v1/booking', bookingData);
  }

  uploadBookings(file: FormData) {
    return this.apiService.post('/api/v1/booking/file/upload', file);
  }

  downloadBookings() {
    return this.apiService.get<Blob>('/api/v1/booking/file/download', {
      responseType: 'blob',
    });
  }
}
