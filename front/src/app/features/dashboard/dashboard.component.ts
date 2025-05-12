import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  DashboardService,
  DataItemChart,
  DataItemTable,
  TableDataResponse,
} from './dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MONTHS } from '../../constants/constants';

registerLocaleData(localePt, 'pt-BR');

interface ChartItem {
  name: string;
  value: number;
}
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    HeaderComponent,
    NgxChartsModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSortModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isLoadingChartData1: boolean = false;
  monthSelectChartData1: string = '';
  dataData1: ChartItem[] = [];

  isLoadingChartData2: boolean = false;
  monthSelectChartData2: string = '';
  dataData2: ChartItem[] = [];

  isLoadingChartData3: boolean = false;
  dataData3: ChartItem[] = [];

  isLoadingDashboardData: boolean = false;
  dashboardDataItems: ChartItem[] = [];

  dataSource = new MatTableDataSource<DataItemTable>();
  displayedColumns: string[] = ['date', 'iatapair', 'departures', 'arrivals'];

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar,
  ) {}

  months = MONTHS;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalCount = 0;

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.dashboardData(this.paginator.pageIndex, this.paginator.pageSize);
    });

    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.chartData1();
    this.chartData2();
    this.chartData3();
    this.dashboardData();
  }

  formatXAxisLabel(value: string): string {
    return formatDate(value, 'dd/MM', 'pt-BR');
  }

  chartData1() {
    this.isLoadingChartData1 = true;

    this.dashboardService.getChartData1({ limit: 5000 }).subscribe({
      next: (response) => {
        const allData = response.data.map((item) => ({
          name: item.category,
          value: item.value,
        }));

        if (this.monthSelectChartData1) {
          this.dataData1 = allData.filter((item) => {
            const month = new Date(item.name).getMonth() + 1; // getMonth() retorna 0-11
            const monthString = month.toString().padStart(2, '0'); // sempre com 2 dígitos
            return monthString === this.monthSelectChartData1;
          });
        } else {
          this.dataData1 = allData;
        }

        this.isLoadingChartData1 = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar os gráficos.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
        this.isLoadingChartData1 = false;
      },
    });
  }

  chartData2() {
    this.isLoadingChartData2 = true;

    this.dashboardService.getChartData2({ limit: 5000 }).subscribe({
      next: (response) => {
        const allData = response.data.map((item) => ({
          name: item.category,
          value: item.value,
        }));

        if (this.monthSelectChartData2) {
          this.dataData2 = allData.filter((item) => {
            const month = new Date(item.name).getMonth() + 1;
            const monthString = month.toString().padStart(2, '0');
            return monthString === this.monthSelectChartData2;
          });
        } else {
          this.dataData2 = allData;
        }

        this.isLoadingChartData2 = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar os gráficos.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
        this.isLoadingChartData2 = false;
      },
    });
  }

  chartData3() {
    this.isLoadingChartData3 = true;

    this.dashboardService.getChartData3({ limit: 5000 }).subscribe({
      next: (response) => {
        const allData = response.data.map((item) => ({
          name: item.category,
          value: item.value,
        }));

        this.dataData3 = allData;

        this.isLoadingChartData3 = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar os gráficos.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
        this.isLoadingChartData3 = false;
      },
    });
  }

  dashboardData(pageIndex: number = 0, pageSize: number = 5) {
    this.isLoadingDashboardData = true;

    this.dashboardService
      .getDashboardData({
        limit: pageSize * (pageIndex + 1),
      })
      .subscribe({
        next: (response: TableDataResponse) => {
          this.dataSource.data = response.data.slice(-pageSize);
          this.totalCount = response.count;
          this.isLoadingDashboardData = false;
        },
        error: () => {
          this.snackBar.open('Erro ao carregar dados da tabela.', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
          this.isLoadingDashboardData = false;
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
