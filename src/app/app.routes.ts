import { Routes } from '@angular/router';
import { ProfileViewComponent } from './components/user/profile/user-profile-view/profile-view.component';
import { DietPlanViewComponent } from './components/shared/diet-plan/diet-plan-view/diet-plan-view.component';
import { ChatViewComponent } from './components/shared/chat/chat-view/chat-view.component';
import { AppointmentViewComponent } from './components/user/appointment/appointment-view/appointment-view.component';


export const routes: Routes = [
  { path: 'profile', component: ProfileViewComponent },
  { path: 'diet-plan', component: DietPlanViewComponent},
  { path: 'chat', component: ChatViewComponent},
  { path: 'appointment', component: AppointmentViewComponent},
  // { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: '**', redirectTo: '/profile' },
];