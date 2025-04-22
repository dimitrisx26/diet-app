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
   * Logic to switch between login and signup components
   */
  isLogin: boolean = true;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  /**
   * Initialize component.
   */
  ngOnInit() {
    if (this.auth.isAuthenticated) {
      this.router.navigate(['/profile']);
    }
  }
}
