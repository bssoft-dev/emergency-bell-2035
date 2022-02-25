import { NoticeComponent } from './main/notice/notice.component';
import { DeviceComponent } from './main/device/device.component';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
