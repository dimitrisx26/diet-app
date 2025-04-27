import { Component } from '@angular/core';
import { ViewComponent } from '../shared/view/view.component';
import { PanelModule } from 'primeng/panel';
import { AdminService } from '../../services/admin/admin.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { ChartModule } from 'primeng/chart';

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
  admins$ = this.admin.loadAdmins();

  /** The list of users */
  users$ = this.admin.loadUsers();

  /** Admin user */
  userAdmin = this.auth.loggedInUser();

  /** The list of users created in the last 7 days */
  recentUsers$;

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
        data: [''],
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
    private auth: AuthService,
  ) {
    this.recentUsers$ = this.recentlyCreatedUsers();
  }

  ngOnInit() {
    this.usersPerMonth();
  }

  /**
   * Fetches the list of users from the server and filters them  to get most recent created.
   * @returns The number of users created in the last 7 days
   */
  recentlyCreatedUsers() {
    return this.users$.pipe(
      map((users) => {
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
          const createdAt = new Date(user.$createdAt);
          return createdAt >= sevenDaysAgo;
        }).length;
      }),
    );
  }

  usersPerMonth() {
    const usersFiltered = this.users$.pipe(
      map((users) => {
        const now = new Date();
        const monthCounts = Array(12).fill(0);
        users.forEach((user) => {
          const createdAt = new Date(user.$createdAt);
          if (createdAt.getFullYear() === now.getFullYear()) {
            monthCounts[createdAt.getMonth()]++;
          }
        });
        return monthCounts;
      }),
    );

    return usersFiltered.subscribe({
      next: (users) => {
        this.userGrowthChartData.datasets[0].data = users;
        this.userGrowthChartData = { ...this.userGrowthChartData };
      },
      error: (err) => {
        console.error('Error fetching user growth data:', err);
      }
    });
  }
}
