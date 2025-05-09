import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title!: string;
  @Input() description?: string;
  @Input() showBackButton: boolean = false;

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
