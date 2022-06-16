import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidefooter',
  templateUrl: './sidefooter.component.html',
  styleUrls: ['./sidefooter.component.css'],
})
export class SidefooterComponent implements OnInit {
  public Amodal: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  clickedModalClose() {
    this.Amodal = false;
  }
  clickedModal() {
    this.Amodal = true;
  }
}
