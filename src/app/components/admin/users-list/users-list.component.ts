import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ViewComponent } from '../../shared/view/view.component';

@Component({
  selector: 'app-users-list',
  imports: [
    CommonModule,
    ViewComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {

}
