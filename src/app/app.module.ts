import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';

import { MainComponent } from './main/main.component';

// 헤더
import { HeaderComponent } from './main/header/header.component';

// 사이드바
import { ProfileComponent } from './main/side/profile/profile.component';
import { SidebarComponent } from './main/side/sidebar/sidebar.component';
import { SidefooterComponent } from './main/side/sidefooter/sidefooter.component';

// 컨포넌트
import { DashboardComponent } from './main/container/dashboard/dashboard.component';
import { AllstatusComponent } from './main/container/dashboard/allstatus/allstatus.component';
import { SensingComponent } from './main/container/dashboard/sensing/sensing.component';

import { MemberComponent } from './main/container/member/member.component';

// 서비스
import { ApiService } from './services/api.service';
import { WebsocketService } from './services/websocket.service';
import { WebsocketComponent } from './websocket/websocket.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'member',
        component: MemberComponent,
      },
    ],
  },
  { path: 'ws', component: WebsocketComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    WebsocketComponent,
    SidebarComponent,
    HeaderComponent,
    ProfileComponent,
    SidefooterComponent,
    DashboardComponent,
    AllstatusComponent,
    SensingComponent,
    MemberComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ApiService, WebsocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
