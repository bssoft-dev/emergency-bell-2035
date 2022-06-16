import { Component, OnInit } from '@angular/core';

import { Sidebar } from './main';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  selectedSide?: Sidebar;

  currentItem = '전체현황';

  addItem(newItem: string) {
    this.currentItem = newItem;
  }

  constructor() {}

  onSelect(side: Sidebar): void {
    this.selectedSide = side;
  }

  ngOnInit(): void {}
}
