import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ViewComponent } from '../../shared/view/view.component';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { BadgeModule } from 'primeng/badge';
import { SupabaseService } from '../../../services/supabase/supabase.service';

@Component({
  selector: 'app-users-list',
  imports: [
    BadgeModule,
    CommonModule,
    ViewComponent,
    TableModule,
    RouterModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  users$ = this.supabase.getAllUsers();

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    console.log(this.users$);
    
  }

  get filledUsers$() {
    return this.users$
      .then((users) => {
        const arr = users ?? [];
        const minRows = 10;
        if (arr.length < minRows) {
          return [
            ...arr,
            ...Array(minRows - arr.length).fill({
              $id: '',
              name: '',
              email: '',
              emailVerification: null,
              $createdAt: null,
              isPlaceholder: true,
            }),
          ];
        }
        return arr;
      });
  }
}
