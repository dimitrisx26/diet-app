import { Component } from '@angular/core';
import { ViewComponent } from "../../../shared/view/view.component";
import { PanelModule } from "primeng/panel";

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [ViewComponent, PanelModule],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent {

}
