import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ViewComponent } from '../../shared/view/view.component';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin/admin.service';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-users-list',
  imports: [
    CommonModule,
    ViewComponent,
    TableModule,
    Tag,
    RouterModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  filledUsers: any[] = [];

  users: Promise<any[]>;

  constructor(private admin: AdminService) {
    this.users = this.admin.getClientUsers();
  }

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.users.then((users) => {
      const arr = users ?? [];
      const minRows = 10;
      if (arr.length < minRows) {
        this.filledUsers = [
          ...arr,
          ...Array(minRows - arr.length).fill({
            id: '',
            name: '',
            email: '',
            email_verification: null,
            created_at: null,
            isPlaceholder: true,
          }),
        ];
      } else {
        this.filledUsers = arr;
      }
    });
  }
}
