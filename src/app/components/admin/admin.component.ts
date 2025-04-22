import { Component } from '@angular/core';
import { ViewComponent } from '../shared/view/view.component';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-admin',
  imports: [ViewComponent, PanelModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
