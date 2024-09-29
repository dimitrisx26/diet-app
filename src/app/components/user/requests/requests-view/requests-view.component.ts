import { Component } from '@angular/core';
import { ViewComponent } from "../../../shared/view/view.component";

@Component({
  selector: 'app-requests-view',
  standalone: true,
  imports: [ViewComponent],
  templateUrl: './requests-view.component.html',
  styleUrl: './requests-view.component.css'
})
export class RequestsViewComponent {

}
