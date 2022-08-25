import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() item = '';
  isChecked: boolean;
  Realbody = document.querySelector('body');

  constructor() {
    this.isChecked = JSON.parse(localStorage.getItem('bgmode'));
    this.whatmode();
  }

  isCheckedchange() {
    this.isChecked = !this.isChecked;
    this.whatmode();
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
