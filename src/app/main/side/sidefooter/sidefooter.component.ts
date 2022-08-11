import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sidefooter',
  templateUrl: './sidefooter.component.html',
  styleUrls: ['../../main.component.css'],
})
export class SidefooterComponent implements OnInit {
  constructor(public router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {}

  token = sessionStorage.getItem('token');

  openDialog(): void {
    const dialogRef = this.dialog.open(SettingmodalComponent, {
      width: '750px',
      height: '1100px',
    });
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

@Component({
  selector: 'app-settingmodal',
  templateUrl: 'settingmodal.component.html',
  styleUrls: ['./settingmodal.component.css'],
})
export class SettingmodalComponent {
  constructor(public dialogRef: MatDialogRef<SettingmodalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
