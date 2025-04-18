import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-view',
    imports: [CommonModule],
    templateUrl: './view.component.html',
    styleUrl: './view.component.css'
})
export class ViewComponent {
  /** Contains the view header info */
  @Input() header!: string;
}
