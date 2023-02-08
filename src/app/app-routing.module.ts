import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { SignUpComponent } from "./components/login/sign-up/sign-up.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component"
import { AuthGuard } from './auth.guard';

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
  // component: DashboardComponent, canActivate:[AuthGuard]
  component: DashboardComponent
},{
  path: '**',
  component: LoginComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
