import { Routes } from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {MainpageComponent} from './mainpage/mainpage.component';
import {NotFoundComponent} from './not-found/not-found.component';

export const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '', component: MainpageComponent},
  {path: '**', redirectTo: '/not-found'}
];
