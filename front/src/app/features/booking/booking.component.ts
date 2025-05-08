import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Booking, BookingResponse, BookingService } from './booking.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  nome: string = '';
  mensagem: string = '';
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
  constructor(private bookingService: BookingService) {}

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

  isLoading = false;
  handleCreateBooking(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    // Criar o objeto bookingData com os dados do formulário
    const bookingData: Booking = {
      first_name: 'bla lsdas',
      last_name: 'ggfhgf', // Este valor pode ser dinâmico ou fixo
      birthday: '1990-01-01', // Use o valor real ou adicione um campo para capturá-lo
      document: '123456789', // Valor fixo para o exemplo
      departure_date: '2025-06-01', // Defina os valores conforme necessário
      departure_iata: 'JFK',
      arrival_iata: 'LAX',
      arrival_date: '2025-06-01',
    };

    // Chamar o serviço para criar a reserva
    this.bookingService.createBooking(bookingData).subscribe(
      (response) => {
        this.mensagem = `Reserva de ${this.nome} criada com sucesso!`;
        console.log(response);
      },
      (error) => {
        this.mensagem = `Erro ao criar a reserva de ${this.nome}.`;
        console.error(error);
      }
    );
    this.isLoading = false;
  }

  handleDownloadBookings(event: Event) {
    event.preventDefault();

    this.bookingService.downloadBookings().subscribe(
      (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const timestamp = `${now.getFullYear()}-${pad(
          now.getMonth() + 1
        )}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(
          now.getMinutes()
        )}`;
        const fileName = `reservas-${timestamp}.xlsx`;

        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        this.mensagem = `Erro ao fazer download das reservas.`;
        console.error(error);
      }
    );
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
