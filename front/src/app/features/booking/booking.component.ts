import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Booking, BookingResponse, BookingService } from './booking.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatSort,
    HeaderComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  nome: string = '';
  mensagem: string = '';
  isLoadingDownloadBookings: boolean = false;

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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Chama o método getBookings ao inicializar o componente
    this.getBookings();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.paginator.page.subscribe(() => {
      this.getBookings(this.paginator.pageIndex, this.paginator.pageSize);
    });

    this.sort.sortChange.subscribe(() => {
      // Resetar para a primeira página ao ordenar
      this.paginator.pageIndex = 0;
      this.getBookings(this.paginator.pageIndex, this.paginator.pageSize);
    });
  }

  getBookings(pageIndex: number = 0, pageSize: number = 10) {
    const offset = pageIndex * pageSize;

    this.bookingService
      .getBookings({
        limit: pageSize,
      })
      .subscribe(
        (response: BookingResponse) => {
          this.dataSource.data = response.data;
        },
        (error) => {
          this.mensagem = `Erro ao carregar as reservas.`;
          console.error(error);
        }
      );
  }

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
          now.getMonth() + 1
        )}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(
          now.getMinutes()
        )}`;
        const fileName = `reservas-${timestamp}.xlsx`;

        // Configuração do link para download
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revogar URL para liberar recursos
        window.URL.revokeObjectURL(url);

        // Exibir mensagem de sucesso
        this.snackBar.open('Download completo', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
      },
      error: (error) => {
        // Exibir mensagem de erro
        this.snackBar.open('Erro ao fazer download das reservas.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      },
      complete: () => {
        // Resetando o estado de loading
        this.isLoadingDownloadBookings = false;
      },
    });
  }

  selectedFile: File | null = null;

  handleUploadBookings(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];

      const formData = new FormData();
      formData.append('content', this.selectedFile);

      this.bookingService.uploadBookings(formData).subscribe(
        () => {
          this.mensagem = 'Upload realizado com sucesso!';
        },
        (error) => {
          this.mensagem = 'Erro ao fazer upload das reservas.';
          console.error(error);
        }
      );
    }
  }

  // Função para aplicar o filtro na tabela
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
