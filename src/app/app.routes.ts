import { Routes } from '@angular/router';
import { roleGuard } from './components/shared/auth/guards/role.guard';

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
    canActivate: [roleGuard('')],
  },
  {
    path: 'diet-plan',
    loadComponent: () =>
      import(
        './components/shared/diet-plan/diet-plan-view/diet-plan-view.component'
      ).then((c) => c.DietPlanViewComponent),
    canActivate: [roleGuard('')],
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./components/shared/chat/chat-view/chat-view.component').then(
        (c) => c.ChatViewComponent,
      ),
    canActivate: [roleGuard('')],
  },
  {
    path: 'appointment',
    loadComponent: () =>
      import(
        './components/user/appointment/appointment-view/appointment-view.component'
      ).then((c) => c.AppointmentViewComponent),
    canActivate: [roleGuard('')],
  },
  // Admin routes
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(
        (c) => c.AdminComponent,
      ),
    canActivate: [roleGuard('admin')],
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./components/admin/users-list/users-list.component').then(
        (c) => c.UsersListComponent,
      ),
    canActivate: [roleGuard('admin')],
  },
  {
    path: 'admin/appointments',
    loadComponent: () =>
      import(
        './components/admin/appointments-list/appointments-list.component'
      ).then((c) => c.AppointmentsListComponent),
    canActivate: [roleGuard('admin')],
  },
  {
    path: 'admin/chats',
    loadComponent: () =>
      import('./components/shared/chat/chats-list/chats-list.component').then(
        (c) => c.ChatsListComponent,
      ),
    canActivate: [roleGuard('admin')],
  },
  {
    path: 'admin/appointment/:userId',
    loadComponent: () =>
      import(
        './components/user/appointment/appointment-view/appointment-view.component'
      ).then((c) => c.AppointmentViewComponent),
    canActivate: [roleGuard('admin')],
  },
  {
    path: 'admin/chat/:userId',
    loadComponent: () =>
      import('./components/shared/chat/chat-view/chat-view.component').then(
        (c) => c.ChatViewComponent,
      ),
    canActivate: [roleGuard('admin')],
  },
  {
    path: 'admin/diet-plan/:userId',
    loadComponent: () =>
      import(
        './components/shared/diet-plan/diet-plan-view/diet-plan-view.component'
      ).then((c) => c.DietPlanViewComponent),
    canActivate: [roleGuard('admin')],
  },
  {
    path: 'admin/profile/:userId',
    loadComponent: () =>
      import(
        './components/user/profile/user-profile-view/profile-view.component'
      ).then((c) => c.ProfileViewComponent),
    canActivate: [roleGuard('admin')],
  },
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: '**', redirectTo: '/profile' },
];
