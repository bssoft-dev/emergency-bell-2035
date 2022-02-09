import { NoticeComponent } from './main/notice/notice.component';
import { DeviceComponent } from './main/device/device.component';
import { SiteComponent } from './main/site/site.component';
import { MainComponent } from './main/main.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';


import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';

import { RouterModule, Routes, CanActivate  } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './main/user/user.component';

import { ChartModule } from 'angular2-chartjs';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { FormsModule } from '@angular/forms';


import { AuthService } from './auth.service';
import { AngularFireDatabaseModule } from '@angular/fire/database';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent,
    children:[
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'user',
        component: UserComponent
      },
      { 
        path: 'site',
        component: SiteComponent
      },
      {
        path: 'device',
        component: DeviceComponent
      },
      {
        path: 'notice',
        component: NoticeComponent
      }
    ]},
  { path: 'register', component: RegisterComponent},

  { path: '',
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
    SiteComponent,
    UserComponent,
    RegisterComponent,
  ],
  imports: [
    AngularFireAuthModule,
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAEQ4MyV0f1OKQ4u6Y0WR-tQoOm9e_SOhE'
    }),
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    AngularFireDatabaseModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }