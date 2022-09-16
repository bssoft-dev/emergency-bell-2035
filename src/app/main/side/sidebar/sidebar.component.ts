import { Component, Output, EventEmitter, Input } from '@angular/core';
import { SIDES } from './mock-side';
import { Sidebar } from '../main';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../side.component.css'],
})
export class SidebarComponent {
  sides = SIDES;
  selectedSide?: Sidebar;
  target = []; // css 적용
  menulist = [];

  @Input() userLog = [];
  @Output()
  newItemEvent = new EventEmitter<string>();

  constructor() {
    for (var i = 0; i < this.sides.length; i++) {
      this.menulist.push(this.sides[i].menu);
    }
  }

  // 사이드메뉴 클릭시 이벤트
  addNewItem(value) {
    this.newItemEvent.emit(value);

    for (var i = 0; i < this.menulist.length; i++) {
      this.target[0] = document.getElementById(this.menulist[i]);
      this.target[1] = this.target[0].getElementsByClassName('menuName');
      this.target[2] = this.target[0].getElementsByClassName('filter');

      this.target[0].style.width = '';
      this.target[0].style.background = '';
      this.target[0].style.boxShadow = '';
      this.target[0].style.borderRadius = '';

      this.target[1][0].style.color = '';
      this.target[2][0].style.filter = '';

      if (this.menulist[i] == value) {
        this.target[0].style.width = '100%';
        this.target[0].style.background = 'var(--side-hover-bg)';
        this.target[0].style.borderRadius = '10px';
        this.target[0].style.color = 'var(--profile-font-color)';

        this.target[1][0].style.color = 'var(--profile-font-color)';
        this.target[2][0].style.filter =
          'brightness(var(--filter-hover-svg-brightness)';
      }
    }
  }
}
