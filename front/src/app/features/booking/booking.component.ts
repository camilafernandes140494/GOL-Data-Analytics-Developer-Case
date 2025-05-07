import { Component } from '@angular/core';
import { BookingService } from './booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  imports: [
    CommonModule,

  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {
  nome: string = '';
  email: string = '';
  senha: string = '';

  constructor(private bookingService: BookingService) {}

  onCadastrar() {
    const usuario = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
    };

    this.bookingService.createBooking(usuario).subscribe(
      (response) => {
        console.log('Cadastro realizado com sucesso:', response);
        // Aqui você pode redirecionar o usuário ou exibir uma mensagem de sucesso
      },
      (error) => {
        console.error('Erro no cadastro:', error);
        // Aqui você pode exibir uma mensagem de erro
      }
    );
  }
}
