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
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../shared/components/notification/notification.service';

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
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
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
          this.notificationService.error('Erro ao carregar reservas.');

          this.isLoadingBookings = false;
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  readonly dialog = inject(MatDialog);

  openDialogDownloadBooking() {
    this.dialog.open(DialogDownloadBookingComponent);
  }

  openDialogUploadBooking() {
  const dialogRef = this.dialog.open(DialogUploadBookingComponent);

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'uploaded') {
      this.loadBookings(); 
    }
  });
  }

}

@Component({
  selector: 'app-download-booking-dialog',
  templateUrl: 'download-booking-dialog.html',
  styleUrls: ['./booking.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDownloadBookingComponent {
  isLoadingDownloadBookings: boolean = false;

  constructor(
    private bookingService: BookingService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<DialogDownloadBookingComponent>
  ) {}

  handleDownloadBookings(event: Event) {
    event.preventDefault();
    this.isLoadingDownloadBookings = true;

    this.bookingService.downloadBookings().subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const timestamp = `${now.getFullYear()}-${pad(
          now.getMonth() + 1,
        )}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}`;
        const fileName = `reservas-${timestamp}.xlsx`;

        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
        this.notificationService.success('Download completo');
        this.dialogRef.close(); 
      },
      error: () => {
        this.notificationService.error('Erro ao fazer download das reservas.');
        this.isLoadingDownloadBookings = false;
        this.dialogRef.close();
      },
    });
  }
}

@Component({
  selector: 'app-upload-booking-dialog',
  templateUrl: 'upload-booking-dialog.html',
  styleUrls: ['./booking.component.scss'],
  imports: [MatDialogModule, MatButtonModule,MatProgressSpinnerModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogUploadBookingComponent {
  isLoadingUploadBookings: boolean = false;
  constructor(
    private bookingService: BookingService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<DialogUploadBookingComponent>

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
          this.notificationService.success('Upload completo!');
          this.dialogRef.close('uploaded');
          this.isLoadingUploadBookings = false;
          this.dialogRef.close();
        },
        error: () => {
          this.notificationService.error('Ocorreu um erro ao tentar reservar');
          this.isLoadingUploadBookings = false;
          this.dialogRef.close();
        },
      });
    }
  }
}
