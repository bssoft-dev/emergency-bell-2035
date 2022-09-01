import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sensing',
  templateUrl: './sensing.component.html',
  styleUrls: ['./sensing.component.css', '../../container.table.css'],
})
export class SensingComponent implements OnInit {
  @Input() socketrecentdata = [];

  dataSource = this.socketrecentdata;
  displayedColumns = ['time', 'location', 'type'];

  constructor() {}

  ngOnInit(): void {}
}
