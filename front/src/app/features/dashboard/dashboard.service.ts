import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getChartData1() {
    return this.apiService.get('/dashboard/chart/data/1');
  }

  getChartData2() {
    return this.apiService.get('/dashboard/chart/data/2');
  }

  getChartData3() {
    return this.apiService.get('/dashboard/chart/data/3');
  }

  getDashboardData() {
    return this.apiService.get('/dashboard/data');
  }
}
