import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sidebar } from '../main';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  // 제목
  @Input() side?:  Sidebar;

  
  // 다크모드
  active = false;
  @Output() bcmode = new EventEmitter<boolean>();
  updateMode(mode: boolean) {
    this.active = !mode;
    this.bcmode.emit(mode);
  }
  
  constructor() { }

  ngOnInit(): void {
  }
}
