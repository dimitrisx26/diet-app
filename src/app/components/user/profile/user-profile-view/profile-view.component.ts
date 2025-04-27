import { Component } from '@angular/core';
import { ViewComponent } from '../../../shared/view/view.component';
import { PanelModule } from 'primeng/panel';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { UserService } from '../../../../services/user/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-profile-view',
  imports: [
    BadgeModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    ViewComponent,
    PanelModule,
    ToastModule,
  ],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css',
})
export class ProfileViewComponent {
  /** The user's admin state */
  isAdmin$ = this.auth.isAdmin();

  profileForm!: FormGroup;

  /** The user's data */
  user: any;

  /**
   * @param admin AdminService instance to fetch user data
   * @param router Router instance to navigate between routes
   */
  constructor(
    private admin: AdminService,
    private auth: AuthService,
    private fb: FormBuilder,
    private toast: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'];
  }

  /** Initializes the component */
  ngOnInit() {
    this.loadUser();

    this.profileForm = this.fb.group({
      name: [
        this.user?.user_metadata.name || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      phone: [
        this.user?.phone || '',
        [
          Validators.pattern(/^(\+30|0030|30)?6\d{9}$/),
        ],
      ],
    });
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

  /**
   * Checks if the form control is valid and saves the data
   */
  onSave() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updatedUser = {
      ...this.user,
      user_metadata: {
        ...this.user.user_metadata,
        name: this.profileForm.value.name,
      },
      email: this.profileForm.value.email,
      phone: this.profileForm.value.phone,
    };

    this.userService.updateUser(this.user.$id, updatedUser).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User updated successfully',
          life: 3000,
        });
      },
      error: (err) => {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update user',
          life: 3000,
        });
      },
    });
  }
}
