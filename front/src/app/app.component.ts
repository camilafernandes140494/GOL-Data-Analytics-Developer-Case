import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private router: Router) {}

  activeTab: string = '';

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
    this.activeTab = 'dashboard';
  }

  navigateToBooking() {
    this.router.navigate(['/booking']);
    this.activeTab = 'booking';
  }
  ngOnInit() {
    const currentUrl = window.location.href;
    const lastSegment = currentUrl.split('/').pop() ?? '';
    this.activeTab = lastSegment.includes('dashboard')
      ? 'dashboard'
      : 'booking';
  }
}
