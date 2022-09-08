import { Component, Input, DoCheck } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements DoCheck {
  @Input() item = '';
  isChecked: boolean;
  Realbody = document.querySelector('body');

  constructor() {
    this.isChecked = JSON.parse(localStorage.getItem('bgmode'));
    this.whatmode();
  }

  // 상시 체크
  ngDoCheck() {
    if (this.isChecked != JSON.parse(localStorage.getItem('bgmode'))) {
      this.whatmode();
    }
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
