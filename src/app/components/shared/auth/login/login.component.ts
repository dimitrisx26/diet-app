import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthStore } from '../../../../store/auth.store';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  /**
   * Logic to switch between login and signup components
   */
  @Input() isLogin: boolean = true;

  /**
   * Event emitter to notify parent component about form state change
   */
  @Output() isLoginChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** FormGroup instance to manage the login form */
  loginForm: FormGroup;

  /** The loading state */
  loading: boolean = false;

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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  /**
   * Logs in the user
   */
  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
  
    let { email, password } = this.loginForm.value;
    email = email.trim();
    this.loading = true;
  
    this.authStore
      .login(email, password)
      .catch((error) => {
        console.error('Login error:', error);
        
        let message = 'Login failed. Please check your credentials.';
        if (error.message) {
          if (error.message.includes('Invalid login')) {
            message = 'Invalid email or password. Please try again.';
          } else if (error.message.includes('Email not confirmed')) {
            message = 'Please confirm your email before logging in.';
          } else {
            message = error.message;
          }
        }
        
        this.toast.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: message,
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
