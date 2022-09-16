import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sensing',
  templateUrl: './sensing.component.html',
  styleUrls: ['./sensing.component.css', '../../container.table.css'],
})
export class SensingComponent  {
  @Input() socketrecentdata = [];

  displayedColumns = ['time', 'location', 'type'];

  constructor() {}


}
