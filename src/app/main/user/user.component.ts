import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  checking = ""


  constructor() { }

  ngOnInit() {
  }


  getCheckboxValue(event) {
    let result = '';
    if (event.target.checked) {
      result = event.target.value;
      console.log(result)
    } else {
      result = 'unch';
      console.log(result)
    }


  }


}
