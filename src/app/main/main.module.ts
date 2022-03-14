import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@fortawesome/fontawesome-free/js/all.js';


import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
  ],
})
export class MainModule { }
