import { CommonModule } from "@angular/common";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from "src/app/modules/home/home.component";
import { NgModule } from "@angular/core";
import { HomeRoutingModule } from "src/app/modules/home/home.routing";
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatSnackBarModule
  ],
  providers: [],
})
export class HomeModule { }
