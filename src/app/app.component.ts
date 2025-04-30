import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/shared/menu/menu.component';
import { AuthComponent } from './components/shared/auth/auth.component';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AuthStore } from './store/auth.store';

@Component({
  selector: 'app-root',
  imports: [AuthComponent, CommonModule, MenuComponent, ProgressSpinner, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  /**
   * @param authStore AuthStore instance to manage authentication state
   */
  constructor(
    public authStore: AuthStore,
  ) {}

  /**
   * Initialize component.
   */
  async ngOnInit() {
    await this.authStore.initAuth();
  }
}
