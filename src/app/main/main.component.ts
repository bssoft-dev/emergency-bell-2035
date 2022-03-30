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
    this.is_hyperuser = sessionStorage.getItem('is_hyperuser');
    this.corplogo = sessionStorage.getItem('corplogo');
  }

  logout() {
    sessionStorage.removeItem('is_hyperuser');
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("customer_code")
    sessionStorage.removeItem("corplogo")
    this.router.navigate(['/login'])
  }

  active = [];

  outputEvent(active: any) {
    this.active = active;
  }
}
