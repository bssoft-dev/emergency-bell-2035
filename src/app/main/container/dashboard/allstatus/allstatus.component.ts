import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-allstatus',
  templateUrl: './allstatus.component.html',
  styleUrls: ['./allstatus.component.css'],
})
export class AllstatusComponent implements OnInit {
  @Input() socketdevicesdata = '';
  rowHeight: number | string = '17.2dvh';
  constructor() {}

  ngOnInit() {}
  ngDoCheck() {
    if (window.innerWidth >= window.innerHeight) {
      if(window.innerWidth >= 992 && window.innerWidth <= 1200) this.rowHeight = '14.6dvh';
      else if (window.innerHeight <= 992) this.rowHeight = '14.5dvh';
    } else if (window.innerWidth <= 576) {
      this.rowHeight = '15.7dvh'
    }
  }
}
