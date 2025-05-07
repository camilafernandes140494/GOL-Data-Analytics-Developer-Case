import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Booking, BookingResponse, BookingService } from './booking.service';

@Component({
  selector: 'app-booking',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  nome: string = '';
  mensagem: string = '';
  isClicked: boolean = false;

  // Dados de exemplo para a tabela
  reservas: Booking[] = [];

  displayedColumns: string[] = [
    // 'Nome',
    // 'Sobrenome',
    // 'Data de nascimento',
    // 'Documento',
    // 'Data de partida',
    // 'Data de chegada',
  ];
  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    // Chama o método getBookings ao inicializar o componente
    this.getBookings();
  }

  // Método para carregar as reservas da API
  getBookings() {
    this.bookingService.getBookings().subscribe(
      (response: BookingResponse) => {
        this.reservas = response.data; // Atualiza a variável reservas com a resposta da API
        console.log('Reservas carregadas:', this.reservas);
      },
      (error) => {
        this.mensagem = `Erro ao carregar as reservas.`;
        console.error(error);
      }
    );
  }
  alterarEstado(event: Event) {
    event.preventDefault();
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
        this.isClicked = true;
        console.log(response);
      },
      (error) => {
        this.mensagem = `Erro ao criar a reserva de ${this.nome}.`;
        console.error(error);
      }
    );
  }

  // Função para enviar o formulário (exemplo)
  enviar() {
    this.mensagem = `Reserva de ${this.nome} enviada com sucesso!`;
  }
}
