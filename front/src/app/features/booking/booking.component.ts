import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Booking, BookingResponse, BookingService } from './booking.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-booking',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    HeaderComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatDialogModule,
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  nome: string = '';

  isLoadingBookings: boolean = false;
  // Dados de exemplo para a tabela
  dataSource = new MatTableDataSource<Booking>();

  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'birthday',
    'document',
    'departure_date',
    'departure_iata',
    'arrival_iata',
    'arrival_date',
  ];
  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    // Chama o método getBookings ao inicializar o componente
    this.loadBookings();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  totalCount = 0;
  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.loadBookings(this.paginator.pageIndex, this.paginator.pageSize);
    });

    this.dataSource.sort = this.sort;
  }

  loadBookings(pageIndex: number = 0, pageSize: number = 5) {
    this.isLoadingBookings = true;

    this.bookingService
      .getBookings({
        limit: pageSize * (pageIndex + 1),
      })
      .subscribe({
        next: (response: BookingResponse) => {
          this.dataSource.data = response.data.slice(-pageSize);
          this.totalCount = response.count;
          this.isLoadingBookings = false;
        },
        error: () => {
          this.snackBar.open('Erro ao carregar as reservas.', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
          this.isLoadingBookings = false;
        },
      });
  }

  // Função para aplicar o filtro na tabela
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  readonly dialog = inject(MatDialog);

  openDialogDownloadBooking() {
    this.dialog.open(DialogDownloadBooking);
  }

  openDialogUploadBooking() {
    this.dialog.open(DialogUploadBooking);
  }
}

@Component({
  selector: 'download-booking-dialog',
  templateUrl: 'download-booking-dialog.html',
  styleUrls: ['./booking.component.scss'],
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDownloadBooking {
  isLoadingDownloadBookings: boolean = false;

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
  ) {}

  handleDownloadBookings(event: Event) {
    event.preventDefault();
    this.isLoadingDownloadBookings = true;

    this.bookingService.downloadBookings().subscribe({
      next: (response: Blob) => {
        // Criação do Blob com o conteúdo recebido
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Criação do link para o download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        // Criação do nome do arquivo com timestamp
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const timestamp = `${now.getFullYear()}-${pad(
          now.getMonth() + 1,
        )}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}`;
        const fileName = `reservas-${timestamp}.xlsx`;

        // Configuração do link para download
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revogar URL para liberar recursos
        window.URL.revokeObjectURL(url);

        this.snackBar.open('Download completo', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
      },
      error: () => {
        this.snackBar.open('Erro ao fazer download das reservas.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
        this.isLoadingDownloadBookings = false;
      },
    });
  }
}

@Component({
  selector: 'upload-booking-dialog',
  templateUrl: 'upload-booking-dialog.html',
  styleUrls: ['./booking.component.scss'],
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogUploadBooking {
  isLoadingUploadBookings: boolean = false;
  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
  ) {}

  selectedFile: File | null = null;

  handleUploadBookings(event: Event) {
    this.isLoadingUploadBookings = true;
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];

      const formData = new FormData();
      formData.append('content', this.selectedFile);

      this.bookingService.uploadBookings(formData).subscribe({
        next: () => {
          this.snackBar.open('Upload completo', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-success'],
          });
          this.isLoadingUploadBookings = false;
        },
        error: () => {
          this.snackBar.open('Erro ao fazer upload das reservas.', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
          this.isLoadingUploadBookings = false;
        },
      });
    }
  }
}
