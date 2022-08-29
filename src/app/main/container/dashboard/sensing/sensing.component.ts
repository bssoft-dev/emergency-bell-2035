import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sensing',
  templateUrl: './sensing.component.html',
  styleUrls: ['./sensing.component.css', '../../container.component.css'],
})
export class SensingComponent implements OnInit {
  @Input() socketrecentdata = [];
  socketLength = this.socketrecentdata.length;

  displayedColumns: string[] = ['시간', '설치장소', '타입'];

  constructor() {
    if (this.socketLength == 0) {
      // this.socketLength['time'] = '';
    }
  }

  ngOnInit(): void {}
}
