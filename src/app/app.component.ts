import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { UserProfileViewComponent } from "./user-profile/user-profile-view/user-profile-view.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterOutlet, UserProfileViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ems-app';
}
