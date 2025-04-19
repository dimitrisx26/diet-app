import { Component } from '@angular/core';
import { ViewComponent } from '../../view/view.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chats-list',
  imports: [
    CommonModule,
    ViewComponent
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.css'
})
export class ChatsListComponent {

}
