import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/shared/menu/menu.component';
import { AuthComponent } from './components/shared/auth/auth.component';

@Component({
    selector: 'app-root',
    imports: [
      AuthComponent,
      CommonModule,
      MenuComponent,
      RouterOutlet,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  /**
   * the state of the application
   */
  isAuthenticated: boolean = false;

}
