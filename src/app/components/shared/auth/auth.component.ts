import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, LoginComponent, SignupComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  /**
   * the state of the application
   */
  isAuthenticated: boolean;

  /**
   * Logic to switch between login and signup components
   */
  isLogin: boolean = true;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    this.isAuthenticated = this.auth.isAuthenticated;
  }

  /**
   * Initialize component.
   */
  ngOnInit() {
    if (this.isAuthenticated) {
      this.router.navigate(['/profile']);
    }
  }
}
