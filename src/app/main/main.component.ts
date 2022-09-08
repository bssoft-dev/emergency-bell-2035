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
  situation = false;
  opened: boolean;
  token = sessionStorage.getItem('token');
  user = false;

  constructor(private _snackBar: MatSnackBar, private service: ApiService) {}

  // 상시 체크
  ngDoCheck() {
    if (!this.user) {
      this.userCheck();
    }
    if (JSON.parse(localStorage.getItem('situation'))) {
      localStorage.setItem('situation', JSON.stringify(false));
      this.openSnackBar();
      this.situation = true;
      setTimeout(() => {
        this.situation = false;
      }, 10000);
    }
  }

  // 사용자 체크
  userCheck() {
    this.user = true;
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          // 토큰
          localStorage.setItem('token', JSON.stringify(this.token));
          // 하이퍼유저
          localStorage.setItem('hyperuser', JSON.stringify(res.is_hyperuser));
          // 커스터머유저
          localStorage.setItem(
            'customeruser',
            JSON.stringify(res.customerCode)
          );
          // 슈퍼유저
          localStorage.setItem('superuser', JSON.stringify(res.is_superuser));

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

  // 이벤트 발생 시 알림창
  openSnackBar() {
    this._snackBar.open(localStorage.getItem('popupdata'), '닫기', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
