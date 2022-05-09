import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';

import { DeviceComponent } from './main/device/device.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { UserComponent } from './main/user/user.component';
import { ClientComponent } from './main/client/client.component';
import { ProfileComponent } from './main/profile/profile.component';

import { ApiService } from './services/api.service';
import { WebsocketService } from './services/websocket.service';
import { WebsocketComponent } from './websocket/websocket.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { AlldetectionComponent } from './main/alldetection/alldetection.component';
import { HeaderComponent } from './main/header/header.component';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main', component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: 'client',
        component: ClientComponent
      },
      {
        path: 'device',
        component: DeviceComponent
      },
      {
        path: 'alldetection',
        component: AlldetectionComponent
      },
    ]
  },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'ws', component: WebsocketComponent },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    DashboardComponent,
    DeviceComponent,
    UserComponent,
    ClientComponent,
    WebsocketComponent,
    ForgotpasswordComponent,
    AlldetectionComponent,
    HeaderComponent,
    ProfileComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
    ApiService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
