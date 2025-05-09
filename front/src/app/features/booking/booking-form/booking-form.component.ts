import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Booking, BookingService } from '../booking.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AIRPORT_CODES } from '../../../constants/constants';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
  ],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingFormComponent implements OnInit {
  myControl = new FormControl('');
  bookingForm: FormGroup;

  options: string[] = AIRPORT_CODES;
  filteredOptions!: Observable<string[]>; // Adicionado ! para garantir a inicialização

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {
    // Criando o formulário reativo
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
    // Configurando o autocomplete para o campo de aeroportos
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  handleCreateBooking(event: Event) {
    event.preventDefault();

    if (this.bookingForm.valid) {
      const bookingData = this.bookingForm.value;

      this.bookingService.createBooking(bookingData).subscribe(
        (response) => {
          this.snackBar.open('Reserva criada com sucesso!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-success'],
          });
        },
        (error) => {
          this.snackBar.open('Ocorreu um erro ao tentar reservar', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
        }
      );
    } else {
      this.snackBar.open(
        'Por favor, preencha todos os campos corretamente.',
        '',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-warning'],
        }
      );
    }
  }
}
