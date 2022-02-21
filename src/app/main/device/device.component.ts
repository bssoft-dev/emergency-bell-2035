import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  public modal: boolean = false;

  constructor() {}

  ngOnInit() {
  }


  clickedModalClose(){
    this.modal = false;
  }
  clickedModal(){
    this.modal = true;
  }
}
