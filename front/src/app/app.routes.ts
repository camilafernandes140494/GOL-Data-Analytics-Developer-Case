import { Routes } from '@angular/router';
import { BookingComponent } from './features/booking/booking.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BookingFormComponent } from './features/booking/booking-form/booking-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'booking', pathMatch: 'full' },
  { path: 'booking', component: BookingComponent },
  { path: 'create-booking', component: BookingFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: 'booking' }

];
