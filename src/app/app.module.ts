import { NoticeComponent } from './main/notice/notice.component';
import { DeviceComponent } from './main/device/device.component';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';



import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';

import { RouterModule, Routes, CanActivate } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './main/user/user.component';
import { ClientComponent } from './main/client/client.component';

import { ApiService } from './services/api.service';
import { WebsocketService } from './services/websocket.service';
import { WebsocketComponent } from './websocket/websocket.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { PopoverComponent } from './popover/popover.component';



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
        path: 'notice',
        component: NoticeComponent
      }
    ]
  },
  { path: 'register', component: RegisterComponent },
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
    NoticeComponent,
    UserComponent,
    ClientComponent,
    RegisterComponent,
    WebsocketComponent,
    ForgotpasswordComponent,
    PopoverComponent,
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
