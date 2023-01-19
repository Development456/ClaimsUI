import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component"
import { AuthGuard } from './auth.guard';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
  {
  path: 'login',
  component: LoginComponent
},
{
  path: 'signUp',
  component: SignUpComponent
},
{
  path: 'home',
  component: DashboardComponent, canActivate:[AuthGuard]
},{
  path: '**',
  component: LoginComponent
},{
  path: '',
  component: LoginComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
