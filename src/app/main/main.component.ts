import { Component, DoCheck } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements DoCheck {
  currentItem = localStorage.getItem('whatTitle');
  situation = false;
  showFiller = false;
  innerWidth: boolean;
  opened: boolean;

  constructor(private _snackBar: MatSnackBar) {}

  // 상시 체크
  ngDoCheck() {
    if (window.innerWidth > 1500) {
      this.innerWidth = true;
    } else {
      this.innerWidth = false;
    }
    console.log(`화면상태 : ${this.innerWidth}`);
    if (JSON.parse(localStorage.getItem('situation'))) {
      localStorage.setItem('situation', JSON.stringify(false));
      this.openSnackBar();
      this.situation = true;
      setTimeout(() => {
        this.situation = false;
      }, 10000);
      console.log('situation : ', this.situation);
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
}
