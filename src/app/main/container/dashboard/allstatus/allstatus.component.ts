import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-allstatus',
  templateUrl: './allstatus.component.html',
  styleUrls: ['./allstatus.component.css'],
})
export class AllstatusComponent implements OnInit {
  @Input() socketdevicesdata = '';
  constructor() {}

  ngOnInit() {}
}
