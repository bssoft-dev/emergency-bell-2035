import { MainComponent } from './main.component';
/* import { MapBoxModule } from 'angular-mapbox/module'; */
import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@fortawesome/fontawesome-free/js/all.js';


import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCE0nvTeHBsiQIrbpMVTe489_O5mwyqofk'})/* ,
    MapBoxModule.forRoot('pk.eyJ1IjoiYnVtc3VramFuZyIsImEiOiJjam93YjBmenAxZ3pzM3NwamwycGF2amFxIn0.f6yryjJn1NMUzgjWxdquNQ')     */
  ],
  declarations: [
  ]
})
export class MainModule { }
