import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    CardModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    RouterModule,
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
   * Event emitter to notify parent component about login state change
   */
  @Output() isLoginChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * It toggles the login state and emits the event to the parent component
   */
  toggleLogin() {
    this.isLogin = !this.isLogin;
    this.isLoginChange.emit(this.isLogin);
  }
}
