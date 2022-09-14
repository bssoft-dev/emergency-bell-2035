import { Component, OnInit, Input } from '@angular/core';
const ELEMENT_DATA = [
  { time: '', location: '', type: '' },
  { time: '', location: '', type: '' },
  { time: '', location: '', type: '' },
  { time: '', location: '', type: '' },
  { time: '', location: '', type: '' },
];
@Component({
  selector: 'app-sensing',
  templateUrl: './sensing.component.html',
  styleUrls: ['./sensing.component.css', '../../container.table.css'],
})
export class SensingComponent implements OnInit {
  @Input() socketrecentdata = [];

  dataSource = this.socketrecentdata;
  displayedColumns = ['time', 'location', 'type'];

  constructor() {
    if (this.socketrecentdata.length < 1) {
      this.dataSource = ELEMENT_DATA;
    }
  }

  ngOnInit(): void {}
}
