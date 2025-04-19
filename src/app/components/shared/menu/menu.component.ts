import { CommonModule } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, ButtonModule, CardModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  /**
   * @param el ElementRef
   */
  constructor(private el: ElementRef) {}

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
}
