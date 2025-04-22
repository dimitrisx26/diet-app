import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./components/shared/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/user/profile/user-profile-view/profile-view.component').then(m => m.ProfileViewComponent)
  },
  {
    path: 'diet-plan',
    loadComponent: () =>
      import('./components/shared/diet-plan/diet-plan-view/diet-plan-view.component').then(m => m.DietPlanViewComponent)
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./components/shared/chat/chat-view/chat-view.component').then(m => m.ChatViewComponent)
  },
  {
    path: 'appointment',
    loadComponent: () =>
      import('./components/user/appointment/appointment-view/appointment-view.component').then(m => m.AppointmentViewComponent)
  },
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: '**', redirectTo: '/profile' },
];