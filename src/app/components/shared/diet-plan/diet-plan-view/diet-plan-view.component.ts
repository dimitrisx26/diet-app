import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ViewComponent } from '../../view/view.component';

@Component({
  selector: 'app-diet-plan-view',
  imports: [
    CommonModule,
    ViewComponent
  ],
  templateUrl: './diet-plan-view.component.html',
  styleUrl: './diet-plan-view.component.css'
})
export class DietPlanViewComponent {

}
