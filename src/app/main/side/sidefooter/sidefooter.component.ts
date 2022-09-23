import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sidefooter',
  templateUrl: './sidefooter.component.html',
  styleUrls: ['../side.component.css'],
})
export class SidefooterComponent implements DoCheck {
  constructor(public router: Router, public dialog: MatDialog) {}

  bgmode: boolean;

  // 상시 체크
  ngDoCheck() {
    this.bgmode = JSON.parse(localStorage.getItem('bgmode'));
  }

  token = sessionStorage.getItem('token');

  // 팝업창열기
  openDialog(): void {
    const dialogRef = this.dialog.open(SettingmodalComponent, {
      width: '600px',
      height: '1100px',
    });
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
    localStorage.setItem('whatTitle', '');
  }
}

@Component({
  selector: 'app-settingmodal',
  templateUrl: 'settingmodal.component.html',
  styleUrls: ['../../popup.css', './settingmodal.component.css'],
})
export class SettingmodalComponent {
  constructor(public dialogRef: MatDialogRef<SettingmodalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
