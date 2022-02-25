import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  checking = "checked"
  event: any;


  constructor() { }

  ngOnInit() {
  }


  getCheckboxValue() {
    if (this.checking === "") {
      this.checking = "checked"
      console.log(this.checking)

    } else {
      this.checking = ""
      console.log(this.checking)
    }

  }


}
