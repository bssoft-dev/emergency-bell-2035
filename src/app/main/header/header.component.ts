import { Component, Input, DoCheck } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements DoCheck {
  @Input() item = '';
  isChecked: boolean = true;
  Realbody = document.querySelector('body');

  Target = document.getElementById('clock');

  date;
  week = ['일', '월', '화', '수', '목', '금', '토'];
  nowweek;
  nowdate;
  nowtime;

  constructor() {
    this.isChecked = JSON.parse(localStorage.getItem('bgmode'));
    this.whatmode();
    console.log(typeof this.date);
  }

  // 상시 체크
  ngDoCheck() {
    if (this.isChecked != JSON.parse(localStorage.getItem('bgmode'))) {
      this.whatmode();
    }

    this.date = new Date();
    this.nowweek = this.week[this.date.getDay()];

    this.nowdate =
      this.date.getFullYear() +
      '.' +
      (this.date.getMonth() + 1) +
      '.' +
      this.date.getDate() +
      '.' +
      this.nowweek;

    this.nowtime =
      this.date.getHours() +
      ':' +
      this.date.getMinutes() +
      ':' +
      this.date.getSeconds();
  }

  whatmode() {
    if (this.isChecked) {
      this.Realbody.classList.add('darkmode');
    } else {
      this.Realbody.classList.remove('darkmode');
    }
    localStorage.setItem('bgmode', JSON.stringify(this.isChecked));
  }
}
