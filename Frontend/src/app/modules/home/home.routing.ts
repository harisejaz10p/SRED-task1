import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
import { HomeComponent } from "src/app/modules/home/home.component";

const routes: Routes = [
  {path: "", component: HomeComponent, canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
