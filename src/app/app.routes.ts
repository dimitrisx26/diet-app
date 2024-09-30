import { Routes } from '@angular/router';
import { ProfileViewComponent } from './components/user/profile/user-profile-view/profile-view.component';
import { AttendanceViewComponent } from './components/user/attendance/attendance-view/attendance';
import { LeavesViewComponent } from './components/user/leaves/leaves-view/leaves-view.component';
import { PerformanceViewComponent } from './components/user/performance/performance-view/performance-view.component';
import { RequestsViewComponent } from './components/user/requests/requests-view/requests-view.component';
import { LoginComponent } from './components/shared/login/login.component';


export const routes: Routes = [
    { path: 'profile', component: ProfileViewComponent },
    { path: 'attendance', component: AttendanceViewComponent },
    { path: 'leaves', component: LeavesViewComponent },
    { path: 'performance', component: PerformanceViewComponent },
    { path: 'requests', component: RequestsViewComponent },
    // { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/profile', pathMatch: 'full' },
    { path: '**', redirectTo: '/profile' }
];