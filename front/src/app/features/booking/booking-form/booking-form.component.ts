import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AIRPORT_CODES } from '../../../constants/constants';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

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
  myControl = new FormControl('');
  bookingForm: FormGroup;
  isLoading: boolean = false;

  options: string[] = AIRPORT_CODES;
  filteredOptions!: Observable<string[]>;

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private router: Router,
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
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }

  handleCreateBooking(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    if (this.bookingForm.valid) {
      const bookingData = this.bookingForm.value;

      this.bookingService.createBooking(bookingData).subscribe({
        next: () => {
          this.snackBar.open('Reserva criada com sucesso!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-success'],
          });
          this.isLoading = false;
          this.bookingForm.reset();
          this.router.navigate(['/booking']);
        },
        error: () => {
          this.snackBar.open('Ocorreu um erro ao tentar reservar', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
          this.isLoading = false;
        },
      });
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snackbar-warning'],
      });
      this.isLoading = false;
    }
  }
}
