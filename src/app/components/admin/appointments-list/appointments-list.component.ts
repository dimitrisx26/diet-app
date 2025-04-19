import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ViewComponent } from '../../shared/view/view.component';

@Component({
  selector: 'app-appointments-list',
  imports: [
    CommonModule,
    ViewComponent
  ],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent {

}
