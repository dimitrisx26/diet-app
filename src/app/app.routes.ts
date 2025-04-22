import { Routes } from '@angular/router';
import { userGuard } from './components/shared/auth/guards/user.guard';
import { adminGuard } from './components/shared/auth/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./components/shared/auth/auth.component').then(
        (c) => c.AuthComponent,
      ),
  },
  // User routes
  {
    path: 'profile',
    loadComponent: () =>
      import(
        './components/user/profile/user-profile-view/profile-view.component'
      ).then((c) => c.ProfileViewComponent),
    canActivate: [userGuard],
  },
  {
    path: 'diet-plan',
    loadComponent: () =>
      import(
        './components/shared/diet-plan/diet-plan-view/diet-plan-view.component'
      ).then((c) => c.DietPlanViewComponent),
    canActivate: [userGuard],
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./components/shared/chat/chat-view/chat-view.component').then(
        (c) => c.ChatViewComponent,
      ),
    canActivate: [userGuard],
  },
  {
    path: 'appointment',
    loadComponent: () =>
      import(
        './components/user/appointment/appointment-view/appointment-view.component'
      ).then((c) => c.AppointmentViewComponent),
    canActivate: [userGuard],
  },
  // Admin routes
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./components/admin/users-list/users-list.component').then(
        (c) => c.UsersListComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/appointments',
    loadComponent: () =>
      import(
        './components/admin/appointments-list/appointments-list.component'
      ).then((c) => c.AppointmentsListComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/chats',
    loadComponent: () =>
      import('./components/shared/chat/chats-list/chats-list.component').then(
        (c) => c.ChatsListComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/appointment/:userId',
    loadComponent: () =>
      import(
        './components/user/appointment/appointment-view/appointment-view.component'
      ).then((c) => c.AppointmentViewComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/chat/:userId',
    loadComponent: () =>
      import('./components/shared/chat/chat-view/chat-view.component').then(
        (c) => c.ChatViewComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/diet-plan/:userId',
    loadComponent: () =>
      import(
        './components/shared/diet-plan/diet-plan-view/diet-plan-view.component'
      ).then((c) => c.DietPlanViewComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/profile/:userId',
    loadComponent: () =>
      import(
        './components/user/profile/user-profile-view/profile-view.component'
      ).then((c) => c.ProfileViewComponent),
    canActivate: [adminGuard],
  },
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: '**', redirectTo: '/profile' },
];
