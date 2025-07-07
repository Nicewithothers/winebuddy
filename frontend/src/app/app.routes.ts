import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { VineyardDashboardComponent } from './pages/dashboard/vineyard-dashboard/vineyard-dashboard.component';
import { CellarDashboardComponent } from './pages/dashboard/cellar-dashboard/cellar-dashboard.component';
import { BarrelDashboardComponent } from './pages/dashboard/barrel-dashboard/barrel-dashboard.component';
import { WineDashboardComponent } from './pages/dashboard/wine-dashboard/wine-dashboard.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'vineyard-dashboard', component: VineyardDashboardComponent, canActivate: [AuthGuard] },
    { path: 'cellar-dashboard', component: CellarDashboardComponent, canActivate: [AuthGuard] },
    { path: 'barrel-dashboard', component: BarrelDashboardComponent, canActivate: [AuthGuard] },
    { path: 'wine-dashboard', component: WineDashboardComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'not-found', component: NotFoundComponent },
    { path: '', component: MainpageComponent },
    { path: '**', redirectTo: 'not-found' },
];
