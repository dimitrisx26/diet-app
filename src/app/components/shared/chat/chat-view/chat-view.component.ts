import { Component } from '@angular/core';
import { ViewComponent } from '../../view/view.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-view',
  imports: [
    CommonModule,
    ViewComponent
  ],
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.css'
})
export class ChatViewComponent {

}
