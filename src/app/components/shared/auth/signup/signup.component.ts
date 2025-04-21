import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-signup',
  imports: [
    ButtonModule,
    CardModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    RouterModule,
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
