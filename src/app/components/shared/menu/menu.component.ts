import { CommonModule } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-menu',
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        RouterModule
    ],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(private el: ElementRef) { }

  toggle() {
    const menu = this.el.nativeElement.querySelector(".card-container");

    if (menu.classList.contains("is-visible")) {
      menu.classList.remove("is-visible");
    } else {
      menu.classList.add("is-visible");
    }
  }
}
