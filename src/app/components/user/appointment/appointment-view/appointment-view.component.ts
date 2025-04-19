import { Component } from '@angular/core';
import { ViewComponent } from '../../../shared/view/view.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-view',
  imports: [
    CommonModule,
    ViewComponent
  ],
  templateUrl: './appointment-view.component.html',
  styleUrl: './appointment-view.component.css'
})
export class AppointmentViewComponent {

}
