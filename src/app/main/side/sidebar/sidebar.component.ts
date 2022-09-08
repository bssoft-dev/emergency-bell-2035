import {
  Component,
  Output,
  EventEmitter,
  DoCheck,
  OnInit,
} from '@angular/core';
import { SIDES } from './mock-side';
import { Sidebar } from '../main';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../side.component.css'],
})
export class SidebarComponent implements DoCheck, OnInit {
  sides = SIDES;
  selectedSide?: Sidebar;
  hyperuser;
  cnt = 0;
  target;

  @Output() newItemEvent = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}

  // 상시 체크
  ngDoCheck() {
    if (this.cnt != 12) {
      this.hyperuser = JSON.parse(localStorage.getItem('hyperuser'));
      this.cnt += 1;
    }
  }

  addNewItem(value: string) {
    this.newItemEvent.emit(value);

    if (this.target != document.getElementById(value)) {
      console.log(this.target);
      this.target = document.getElementById(value);
      this.target.style.width = '100%';
      this.target.style.background = 'var(--side-hover-bg)';
      this.target.style.boxShadow = 'var(--side-hover-box)';
      this.target.style.borderRadius = '10px';
    } else {
    }
  }
}
