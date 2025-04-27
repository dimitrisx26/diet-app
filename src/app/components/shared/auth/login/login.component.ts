import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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

  /**
   * @param auth AuthService instance to handle authentication
   * @param fb FormBuilder instance to build reactive forms
   * @param toast MessageService instance to show toast messages
   */
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private toast: MessageService,
    private router: Router
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

    const { email, password } = this.loginForm.value;

    this.auth
      .login(email, password)
      .then(() => {
        this.toast.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: `Welcome back ${this.auth.loggedInUser.name}`,
          life: 3000,
        });
        this.router.navigate(['/profile']);
      })
      .catch((error) => {
        this.toast.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: error.message,
          life: 3000,
        });
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
