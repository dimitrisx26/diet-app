import { Component } from '@angular/core';
import { ViewComponent } from '../../view/view.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diet-plan-editor',
  imports: [
    CommonModule,
    ViewComponent
  ],
  templateUrl: './diet-plan-editor.component.html',
  styleUrl: './diet-plan-editor.component.css'
})
export class DietPlanEditorComponent {

}
