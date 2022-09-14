import { Component, Output, EventEmitter, DoCheck } from '@angular/core';
import { SIDES } from './mock-side';
import { Sidebar } from '../main';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../side.component.css'],
})
export class SidebarComponent implements DoCheck {
  sides = SIDES;
  selectedSide?: Sidebar;
  hyperuser;
  cnt = 0;
  targetId;
  targetText;
  targetImg;
  menulist = [];
  menuvalue = '';

  @Output() newItemEvent = new EventEmitter<string>();
  constructor() {
    for (var i = 0; i < this.sides.length; i++) {
      this.menulist.push(this.sides[i].menu);
    }
  }

  // 하이퍼유저 체크
  ngDoCheck() {
    if (this.cnt != 12) {
      this.hyperuser = JSON.parse(localStorage.getItem('hyperuser'));
      this.cnt += 1;
    }
  }

  // 사이드메뉴 클릭시 이벤트
  addNewItem(value) {
    this.newItemEvent.emit(value);
    this.menuvalue = value;

    for (var i = 0; i < this.menulist.length; i++) {
      this.targetId = document.getElementById(this.menulist[i]);
      this.targetText = this.targetId.getElementsByClassName('menuName');
      this.targetImg = this.targetId.getElementsByClassName('filter');

      this.targetId.style.width = '';
      this.targetId.style.background = '';
      this.targetId.style.boxShadow = '';
      this.targetId.style.borderRadius = '';

      this.targetText[0].style.color = '';
      this.targetImg[0].style.filter = '';

      if (this.menulist[i] == this.menuvalue) {
        this.targetId.style.width = '100%';
        this.targetId.style.background = 'var(--side-hover-bg)';
        this.targetId.style.borderRadius = '10px';
        this.targetId.style.color = 'var(--profile-font-color)';

        this.targetText[0].style.color = 'var(--profile-font-color)';
        this.targetImg[0].style.filter =
          'brightness(var(--filter-hover-svg-brightness)';
      }
    }
  }
}
