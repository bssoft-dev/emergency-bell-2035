import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public router: Router) { }

  is_hyperuser: any;
  corplogo: any;
  ngOnInit() {
    this.is_hyperuser = localStorage.getItem('is_hyperuser');
    this.corplogo = localStorage.getItem('corplogo');
    console.log(localStorage.getItem('corplogo'), 'wkwkwk')
  }

  logout() {
    localStorage.removeItem('is_hyperuser');
    localStorage.removeItem("token")
    localStorage.removeItem("customer_code")
    localStorage.removeItem("corplogo")
    this.router.navigate(['/login'])
  }

  active = [];

  outputEvent(active: any) {
    this.active = active;
  }
}
