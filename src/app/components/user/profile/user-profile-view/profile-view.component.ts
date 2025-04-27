import { Component } from '@angular/core';
import { ViewComponent } from '../../../shared/view/view.component';
import { PanelModule } from 'primeng/panel';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile-view',
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    ViewComponent,
    PanelModule,
  ],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css',
})
export class ProfileViewComponent {
  /** The user's admin state */
  isAdmin$ = this.auth.isAdmin();

  /** The user's data */
  user: any;

  /**
   * @param admin AdminService instance to fetch user data
   * @param router Router instance to navigate between routes
   */
  constructor(
    private admin: AdminService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'];
  }

  /** Initializes the component */
  ngOnInit() {
    this.loadUser();
  }

  /**
   * Loads the user data
   */
  loadUser() {
    if (this.user) return;
    if (this.isAdmin$) {
      const userId = this.route.snapshot.paramMap.get('userId');
      this.admin.getUserById(userId!).subscribe({
        next: (user) => (this.user = user),
        error: (err) => {
          console.error('User not found', err);
        },
      });
    } else {
      this.user = this.auth.loggedInUser();
    }
  }
}
