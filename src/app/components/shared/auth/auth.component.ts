import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    LoginComponent,
    SignupComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  /**
   * Logic to switch between login and signup components
   */
  isLogin: boolean = true;
}
