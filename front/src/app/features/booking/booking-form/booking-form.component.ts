import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AIRPORT_CODES } from '../../../constants/constants';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/components/notification/notification.service';

@Component({
  selector: 'app-booking-form',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    HeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingFormComponent implements OnInit {
  myControl = new FormControl<string | { value: string; name: string }>('');
  bookingForm: FormGroup;
  isLoading: boolean = false;

  options: { value: string; name: string }[] = AIRPORT_CODES;
  filteredOptionsDeparture: { value: string; name: string }[] = [];
  filteredOptionsArrival: { value: string; name: string }[] = [];

  minArrivalDate: Date | null = null;
  departureDateControl!: FormControl;
  arrivalDateControl!: FormControl;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private dateAdapter: DateAdapter<unknown>,
    private notificationService: NotificationService,
  ) {
    this.bookingForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      birthday: new FormControl('', Validators.required),
      document: new FormControl('', Validators.required),
      departure_date: new FormControl('', Validators.required),
      arrival_date: new FormControl('', Validators.required),
      departure_iata: new FormControl('', Validators.required),
      arrival_iata: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.dateAdapter.setLocale('pt-BR');

    this.departureDateControl = this.bookingForm.get('departure_date') as FormControl;
    this.arrivalDateControl = this.bookingForm.get('arrival_date') as FormControl;
    this.departureDateControl?.valueChanges.subscribe((date: Date) => {
      this.minArrivalDate = date;

      if (this.arrivalDateControl?.value && this.arrivalDateControl.value < date) {
        this.arrivalDateControl.setValue(null);
      }
    });

    this.filteredOptionsDeparture = this.options;
    this.filteredOptionsArrival = this.options;

    this.bookingForm.get('departure_iata')?.valueChanges.subscribe((value) => {
      this.filteredOptionsDeparture = this._filter(value);
    });

    this.bookingForm.get('arrival_iata')?.valueChanges.subscribe((value) => {
      this.filteredOptionsArrival = this._filter(value);
    });
  }

  displayFn(option: { value: string; name: string }): string {
    return option?.name || '';
  }

  private _filter(value: string): { value: string; name: string }[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.name.toLowerCase().includes(filterValue));
  }

  handleCreateBooking(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    if (this.bookingForm.valid) {
      const bookingData = this.bookingForm.value;
      const payload = {
        ...bookingData,
        departure_iata: bookingData.departure_iata?.value || '',
        arrival_iata: bookingData.arrival_iata?.value || '',
      };
      this.bookingService.createBooking(payload).subscribe({
        next: () => {
          this.notificationService.success('Reserva criada com sucesso!');
          this.isLoading = false;
          this.bookingForm.reset();
          this.router.navigate(['/booking']);
        },
        error: () => {
          this.notificationService.error('Ocorreu um erro ao tentar reservar');
          this.isLoading = false;
        },
      });
    } else {
      this.notificationService.warning('Por favor, preencha todos os campos corretamente.');
      this.isLoading = false;
    }
  }
}
