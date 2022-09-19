import { Component, DoCheck } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements DoCheck {
  currentItem = localStorage.getItem('whatTitle');
  situation;
  opened: boolean;
  user = false;

  userLog = [sessionStorage.getItem('token')]; // token, hyperuser, customeruser, superuser

  constructor(private _snackBar: MatSnackBar, private service: ApiService) {
    this.userCheck();
  }

  // 상시 체크
  ngDoCheck() {
    // if (JSON.parse(localStorage.getItem('situation'))) {
    //   localStorage.setItem('situation', JSON.stringify(false));
    //   this.openSnackBar();
    //   this.situation = true;
    // }
    // setTimeout(() => {
    //   this.situation = false;
    // }, 10000);
    if (this.situation) {
      this.openSnackBar();
    }
  }

  // 사용자 체크
  userCheck() {
    this.user = true;
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.userLog[0]).subscribe({
        next: (res) => {
          this.userLog[1] = res.is_hyperuser;
          this.userLog[2] = res.customerCode;
          this.userLog[3] = res.is_superuser;

          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
      });
    });
  }

  // 헤더 타이틀
  addItem(newItem) {
    this.currentItem = newItem;
    localStorage.setItem('whatTitle', newItem);
  }

  addsituation(situation) {
    this.situation = situation;
  }

  // 이벤트 발생 시 알림창
  openSnackBar() {
    alert(localStorage.getItem('popupdata'));
  }
}
