import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * Routes
 */
const routes: Routes = [
  { path: "home", loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'oauth/callback', loadComponent: () => import('./standalone/auth-callback/auth-callback.component').then(m => m.AuthCallBackComponent) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
