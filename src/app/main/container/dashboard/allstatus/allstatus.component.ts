import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-allstatus',
  templateUrl: './allstatus.component.html',
  styleUrls: ['./allstatus.component.css'],
})
export class AllstatusComponent implements OnInit {
  @Input() socketdevicesdata = '';
  rowHeight: number | string = '17.2vh';
  constructor() {}

  ngOnInit() {}
  ngDoCheck() {
    if (window.innerWidth >= window.innerHeight && window.innerWidth >= 992 && window.innerWidth <= 1200) {
      this.rowHeight = '13.9vh'
    } else if (window.innerWidth <= 576) {
      this.rowHeight = '15.7vh'
    }
  }
}
