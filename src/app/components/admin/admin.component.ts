import { Component } from '@angular/core';
import { ViewComponent } from '../shared/view/view.component';
import { PanelModule } from 'primeng/panel';
import { AdminService } from '../../services/admin/admin.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-admin',
  imports: [
    ButtonModule,
    ChartModule,
    CommonModule,
    ViewComponent,
    PanelModule,
    ToastModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  /** The list of admins */
  admins$: Promise<any[]> | undefined;

  /** The admin count */
  adminCount: number = 0;

  /** The list of users */
  users$: Promise<any[]> | undefined;

  /** The user count */
  userCount: number = 0;

  /** Admin user */
  userAdmin: any;

  /** The list of users created in the last 7 days */
  recentUsers: number = 0;

  /** Chart data for users created */
  userGrowthChartData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Users',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: '#22c55e',
        tension: 0.4,
      },
    ],
  };

  /** Options for the user growth chart */
  userGrowthChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  constructor(
    private admin: AdminService,
    private authStore: AuthStore,
  ) {}

  ngOnInit() {
    this.authStore.initAuth();
    this.loadData();
  }

  /**
   * Loads all dashboard data
   */
  private async loadData() {
    this.userAdmin = this.authStore.user();

    this.admins$ = this.admin.getAdminUsers();
    const admins = await this.admins$;
    this.adminCount = admins?.length || 0;

    this.users$ = this.admin.getClientUsers();
    const users = await this.users$;
    this.userCount = users?.length || 0;

    this.recentUsers = await this.calculateRecentUsers(users || []);
    this.usersPerMonth(users || []);
  }

  /**
   * Calculates users created in the last 7 days
   * @param users Array of users
   * @returns Number of recently created users
   */
  private calculateRecentUsers(users: any[]): number {
    const now = new Date();
    const sevenDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7,
      0,
      0,
      0,
      0,
    );

    return users.filter((user) => {
      const createdAt = new Date(user.created_at);
      return createdAt >= sevenDaysAgo;
    }).length;
  }

  /**
   * Calculates users per month for charting
   * @param users Array of users
   */
  private usersPerMonth(users: any[]) {
    const now = new Date();
    const monthCounts = Array(12).fill(0);

    users.forEach((user) => {
      const createdAt = new Date(user.created_at);
      if (createdAt.getFullYear() === now.getFullYear()) {
        monthCounts[createdAt.getMonth()]++;
      }
    });

    this.userGrowthChartData.datasets[0].data = monthCounts;
    this.userGrowthChartData = { ...this.userGrowthChartData };
  }
}
