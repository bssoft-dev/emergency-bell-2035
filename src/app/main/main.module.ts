import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@fortawesome/fontawesome-free/js/all.js';


import { MainRoutingModule } from './main-routing.module';
import { EditprofileComponent } from '../editprofile/editprofile.component';
import { ProfileComponent } from './profile/profile.component';
import { ChartComponent } from './dashboard/chart/chart.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
  ],
  declarations: [
    EditprofileComponent,
    ProfileComponent,
    ChartComponent
  ],
})
export class MainModule { }
