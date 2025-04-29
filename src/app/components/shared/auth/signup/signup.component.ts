import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { AuthStore } from '../../../../store/auth.store';

@Component({
  selector: 'app-signup',
  imports: [
    ButtonModule,
    CardModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  /**
   * Logic to switch between login and signup components
   */
  @Input() isLogin: boolean = false;

  /**
   * Event emitter to notify parent component about form state change
   */
  @Output() isLoginChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Loading state */
  loading: boolean = false;

  /** FormGroup instance to manage the signup form */
  signupForm: FormGroup;

  /**
   * @param authStore AuthStore instance to manage authentication state
   * @param fb FormBuilder instance to build reactive forms
   * @param toast MessageService instance to show toast messages
   */
  constructor(
    private authStore: AuthStore,
    private fb: FormBuilder,
    private toast: MessageService,
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
        ],
      ],
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  /**
   * Signs up the user
   */
  onSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    let { email, password, name } = this.signupForm.value;
    email = email.trim();
    name = name.trim();
    this.loading = true;

    this.authStore
      .register(email, password, name)
      .catch((error) => {
        this.toast.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: error.message || 'An error occurred during registration',
          life: 3000,
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }

  /**
   * It toggles the form state and emits the event to the parent component
   */
  toggleForm() {
    this.isLogin = !this.isLogin;
    this.isLoginChange.emit(this.isLogin);
  }
}
