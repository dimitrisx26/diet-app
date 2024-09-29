import { Component } from '@angular/core';
import { ViewComponent } from "../../../shared/view/view.component";

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [ViewComponent],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent {

}
