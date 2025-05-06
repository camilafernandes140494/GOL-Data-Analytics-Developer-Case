import { Routes } from '@angular/router';
import { BookingComponent } from './features/booking/booking.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'booking', pathMatch: 'full' },
  { path: 'booking', component: BookingComponent },
  { path: 'dashboard', component: DashboardComponent },
];
