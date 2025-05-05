import { Component } from '@angular/core';
import { ViewComponent } from '../../../shared/view/view.component';
import { PanelModule } from 'primeng/panel';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { CommonModule } from '@angular/common';
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
import { AuthStore } from '../../../../store/auth.store';

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
  isAdmin: boolean = false;

  /** Loading state for the user data */
  loading = true;

  /** The form group for the profile form */
  profileForm: FormGroup;

  /** The user's data */
  user: any;

  /**
   * @param admin AdminService instance to fetch user data
   * @param authStore AuthStore instance to check admin state
   * @param fb FormBuilder instance to create reactive forms
   * @param toast MessageService instance to show toast messages
   * @param route ActivatedRoute instance to get route parameters
   * @param router Router instance to navigate between routes
   * @param userService UserService instance to update user data
   */
  constructor(
    private admin: AdminService,
    private authStore: AuthStore,
    private fb: FormBuilder,
    private toast: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {
    this.profileForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^(\+30|0030|30)?6\d{9}$/)]],
    });

    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'];
  }

  /** Initializes the component */
  async ngOnInit() {
    this.isAdmin = await this.authStore.isAdmin();
    await this.loadUser();

    if (this.user) {
      this.updateFormWithUserData();
    }

    this.loading = false;
  }

  /**
   * Loads the user data
   */
  async loadUser() {
    if (this.user) return;

    if (this.isAdmin) {
      const userId = this.route.snapshot.paramMap.get('userId');
      if (!userId) {
        console.error('User ID not found in route parameters');
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User ID missing.',
          life: 3000,
        });
        return;
      }
      try {
        this.user = await this.admin.getUserById(userId);
        if (this.user) {
          this.updateFormWithUserData();
        }
      } catch (err) {
        console.error('Failed to load user data', err);
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user data.',
          life: 3000,
        });
      }
    } else {
      this.user = this.authStore.user();
      if (this.user) {
        this.updateFormWithUserData();
      }
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
    };

    this.userService.updateUser(updatedUser).subscribe({
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

  /**
   * Update form with user data once available
   */
  private updateFormWithUserData() {
    this.profileForm.patchValue({
      name: this.user.user_metadata.name || '',
      email: this.user.email || '',
      phone: this.user.phone || '',
    });
    console.log(this.user);
    
  }
}
