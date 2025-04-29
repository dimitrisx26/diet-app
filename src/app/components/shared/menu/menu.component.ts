import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-menu',
  imports: [
    AvatarModule,
    AvatarGroupModule,
    CommonModule,
    ButtonModule,
    CardModule,
    OverlayBadgeModule,
    RouterModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  /**
   * The admin state of the user
   */
  get isAdmin() {
    return this.authStore.isAdmin();
  }

  /**
   * The state of the application
   */
  get isAuthenticated() {
    return this.authStore.isAuthenticated();
  }

  get user() {
    return this.authStore.user();
  }

  /**
   * @param authStore AuthStore instance to manage authentication state
   * @param el ElementRef to access the DOM element
   */
  constructor(
    private authStore: AuthStore,
    private el: ElementRef,
  ) {}

  /**
   * Gets the initials of the user.
   * @param name The name of the user
   * @returns
   */
  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();
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
  logout() {
    this.authStore.logout();
  }
}
