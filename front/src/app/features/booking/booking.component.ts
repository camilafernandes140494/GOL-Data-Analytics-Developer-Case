import { Component } from '@angular/core';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-booking',
  imports: [],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        console.log(data);
        this.bookings = data as any[];
      },
      error: (err) => {
        console.error('Erro ao buscar reservas:', err);
      },
    });
  }
}
