import { Component, Output, EventEmitter } from '@angular/core';

import { SIDES } from '../../mock-side';
import { Sidebar } from '../../main';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  sides = SIDES;
  selectedSide?: Sidebar;

  @Output() newItemEvent = new EventEmitter<string>();

  addNewItem(value: string) {
    this.newItemEvent.emit(value);
  }

  constructor() {}

  onSelect(side: Sidebar): void {
    this.selectedSide = side;
    console.log(side.menu);
  }

  ngOnInit(): void {}
}
