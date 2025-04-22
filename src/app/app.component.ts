import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/shared/menu/menu.component';
import { AuthComponent } from './components/shared/auth/auth.component';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [AuthComponent, CommonModule, MenuComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  /**
   * the state of the application
   */
  isAuthenticated: boolean;

  /**
   * @param auth AuthService instance to handle authentication
   * @param router Router service to navigate between routes
   */
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
    if (!this.isAuthenticated) {
      this.router.navigate(['/auth']);
    }
  }
}
