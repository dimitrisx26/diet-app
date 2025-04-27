import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ViewComponent } from '../../shared/view/view.component';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin/admin.service';
import { map } from 'rxjs';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-users-list',
  imports: [
    BadgeModule,
    CommonModule,
    ViewComponent,
    TableModule,
    RouterModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  users$ = this.admin.loadUsers();

  constructor(private admin: AdminService) {}

  get filledUsers$() {
    return this.users$.pipe(
      map((users) => {
        const arr = users ?? [];
        const minRows = 10;
        if (arr.length < minRows) {
          return [
            ...arr,
            ...Array(minRows - arr.length).fill({
              $id: '',
              name: '',
              email: '',
              emailVerification: null,
              $createdAt: null,
              isPlaceholder: true,
            }),
          ];
        }
        return arr;
      }),
    );
  }
}
