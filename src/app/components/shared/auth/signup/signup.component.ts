import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../../services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

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
    ToastModule
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

  /** FormGroup instance to manage the signup form */
  signupForm: FormGroup;

  /**
   * @param auth AuthService instance to handle authentication
   * @param fb FormBuilder instance to build reactive forms
   * @param toast MessageService instance to show toast messages
   */
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private toast: MessageService,
    private router: Router,
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
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

    const { email, password, name } = this.signupForm.value;

    this.auth
      .register(email, password, name)
      .then(() => {
        this.toast.add({
          severity: 'success',
          summary: 'Signup Successful',
          detail: `Welcome ${this.auth.loggedInUser.name}`,
          life: 3000,
        });
        this.router.navigate(['/profile']);
      })
      .catch((error) => {
        this.toast.add({
          severity: 'error',
          summary: 'Signup Failed',
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
