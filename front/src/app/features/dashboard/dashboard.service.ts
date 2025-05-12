import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
export interface DataItemChart {
  category: string;
  value: number;
}

export interface ChartDataResponse {
  count: number;
  limit: number;
  data: DataItemChart[];
}

export interface DataItemTable {
  date: string;
  iatapair: string;
  departures: number;
  arrivals: number;
}
export interface TableDataResponse {
  count: number;
  limit: number;
  data: DataItemTable[];
}
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getChartData1(params: { limit?: number }) {
    return this.apiService.get<ChartDataResponse>(
      `/api/v1/dashboard/chart/data/1?limit=${params.limit}`
    );
  }

  getChartData2(params: { limit?: number }) {
    return this.apiService.get<ChartDataResponse>(
      `/api/v1/dashboard/chart/data/2?limit=${params.limit}`
    );
  }

  getChartData3(params: { limit?: number }) {
    return this.apiService.get<ChartDataResponse>(
      `/api/v1/dashboard/chart/data/3?limit=${params.limit}`
    );
  }

  getDashboardData(params: { limit?: number }) {
    return this.apiService.get<TableDataResponse>(
      `/api/v1/dashboard/data?limit=${params.limit}`
    );
  }
}
