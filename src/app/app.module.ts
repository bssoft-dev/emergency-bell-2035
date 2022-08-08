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
import { SettingmodalComponent } from './main/side/sidefooter/sidefooter.component';

// 컨포넌트
import { DashboardComponent } from './main/container/dashboard/dashboard.component';
import { AllstatusComponent } from './main/container/dashboard/allstatus/allstatus.component';
import { SensingComponent } from './main/container/dashboard/sensing/sensing.component';

import { MemberComponent } from './main/container/member/member.component';

import { ClientComponent } from './main/container/client/client.component';

import { DeviceComponent } from './main/container/device/device.component';

import { AlldetectionComponent } from './main/container/alldetection/alldetection.component';

// 서비스
import { ApiService } from './services/api.service';
import { WebsocketService } from './services/websocket.service';
import { WebsocketComponent } from './websocket/websocket.component';

// MUI
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { PhontabComponent } from './main/side/sidefooter/phontab/phontab.component';

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
      {
        path: 'client',
        component: ClientComponent,
      },
      {
        path: 'device',
        component: DeviceComponent,
      },
      {
        path: 'alldetection',
        component: AlldetectionComponent,
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
    ClientComponent,
    DeviceComponent,
    AlldetectionComponent,
    SettingmodalComponent,
    PhontabComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,
  ],
  providers: [ApiService, WebsocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
