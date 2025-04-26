import { Component } from '@angular/core';
import { ViewComponent } from '../shared/view/view.component';
import { PanelModule } from 'primeng/panel';
import { AdminService } from '../../services/admin/admin.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin',
  imports: [ViewComponent, PanelModule, ToastModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  /** The number of users */
  usersCount: number = 0;

  /** The list of users */
  usersList: any[] = [];

  /**
   * @param admin AdminService instance to handle admin operations
   */
  constructor(
    private admin: AdminService,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  /**
   * Load users from the server and update the users count and list.
   */
  loadUsers() {
    this.admin.loadUsers().subscribe((users) => {
      this.usersCount = users.length;
      this.usersList = users;
    });
  }
}
