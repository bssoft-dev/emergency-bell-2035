import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  checking = "checked"
  event: any;

  checktoken = () => {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
    }
  }

  constructor(public router: Router,) { }

  ngOnInit() {
    this.checktoken()
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
