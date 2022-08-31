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
  is_hyperuser;
  token = localStorage.getItem('token');

  constructor(private _snackBar: MatSnackBar, private service: ApiService) {
    this.check_Customer();
  }

  // 상시 체크
  ngDoCheck() {
    if (JSON.parse(localStorage.getItem('situation'))) {
      localStorage.setItem('situation', JSON.stringify(false));
      this.openSnackBar();
      this.situation = true;
      setTimeout(() => {
        this.situation = false;
      }, 10000);
    }
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

  check_Customer() {
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }
}
