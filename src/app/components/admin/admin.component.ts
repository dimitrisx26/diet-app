import { Component } from '@angular/core';
import { ViewComponent } from '../shared/view/view.component';
import { PanelModule } from 'primeng/panel';
import { AdminService } from '../../services/admin/admin.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [
    ButtonModule,
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

  constructor(
    private admin: AdminService,
    private auth: AuthService,
  ) {
    this.recentUsers$ = this.recentlyCreatedUsers();
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
}
