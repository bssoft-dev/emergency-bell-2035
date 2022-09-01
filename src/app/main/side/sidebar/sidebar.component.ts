import { Component, Output, EventEmitter } from '@angular/core';
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
  is_hyperuser;

  @Output() newItemEvent = new EventEmitter<string>();
  constructor() {}

  addNewItem(value: string) {
    this.newItemEvent.emit(value);
  }
}
