import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';

const routes: Routes = [
  {
    path: '', component: AuthenticationComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'register',
        loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
      },
      {
        path: 'forget-password',
        loadChildren: () => import('./forget-password/forget-password.module').then(m => m.ForgetPasswordModule)
      },
      {
        path: 'reset-password/:token',
        loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule)
      },
    ]
  },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
  { path: 'forgetPassword', loadChildren: () => import('./forget-password/forget-password.module').then(m => m.ForgetPasswordModule) },
  { path: 'resetPassword', loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
