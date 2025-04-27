import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../services/auth/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { OverlayBadgeModule } from 'primeng/overlaybadge';


@Component({
  selector: 'app-menu',
  imports: [AvatarModule, AvatarGroupModule, CommonModule, ButtonModule, CardModule, OverlayBadgeModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  /**
   * The state of the application
   */
  isAdmin: boolean = false;

  /** The user */
  user: any = null;

  /**
   * @param auth Service to handle authentication
   * @param el ElementRef
   * @param router Router to navigate
   */
  constructor(
    private auth: AuthService,
    private el: ElementRef,
    private router: Router,
  ) {}

  /** Initializes the component */
  ngOnInit() {
    this.getUser();
  }

  /**
   * Gets the current user and sets the admin state.
   */
  getUser() {
    if (!this.auth.loggedInUser()) {
      this.auth.checkAuth();
    }
    this.isAdmin = this.auth.isAdmin();
    this.user = this.auth.loggedInUser();
  }

  /**
   * Gets the initials of the user.
   * @param name The name of the user
   * @returns 
   */
  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * Gets the color based on the user's name.
   * @param name The name of the user
   * @returns 
   */
  getColor(name: string): string {
    if (!name || typeof name !== 'string' || name.length === 0) {
      return '#cccccc';
    }
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
  }

  /**
   * Toggles the visibility of the menu.
   */
  toggle() {
    const menu = this.el.nativeElement.querySelector('.card-container');

    if (menu.classList.contains('is-visible')) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Closes the menu.
   */
  close() {
    const menu = this.el.nativeElement.querySelector('.card-container');

    menu.classList.remove('is-visible');

    document.removeEventListener('mousedown', this.handleOutsideClick, true);
  }

  /**
   * Opens the menu.
   */
  open() {
    const menu = this.el.nativeElement.querySelector('.card-container');

    menu.classList.add('is-visible');

    document.addEventListener('mousedown', this.handleOutsideClick, true);
  }

  /**
   * Handles the click event outside the menu to close it.
   * @param event MouseEvent
   */
  handleOutsideClick = (event: MouseEvent) => {
    const menu = this.el.nativeElement.querySelector('.card-container');
    const menuBtn = this.el.nativeElement.querySelector('.menu-btn');

    if (
      (menu && menu.contains(event.target as Node)) ||
      (menuBtn && menuBtn.contains(event.target as Node))
    ) {
      return;
    }

    this.close();
  };

  /**
   * Signs out the user and redirects to the login page.
   */
  signOut() {
    this.auth.logout().then(() => {
      this.router.navigate(['/auth']);
    });
  }
}
