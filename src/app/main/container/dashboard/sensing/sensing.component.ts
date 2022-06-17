import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sensing',
  templateUrl: './sensing.component.html',
  styleUrls: ['./sensing.component.css'],
})
export class SensingComponent implements OnInit {
  @Input() socketrecentdata = [];

  constructor() {}

  ngOnInit(): void {}
}
