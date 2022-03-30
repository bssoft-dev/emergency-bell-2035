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
  ngOnInit() {
    this.is_hyperuser = localStorage.getItem('is_hyperuser');

  }

  logout() {
    localStorage.removeItem('is_hyperuser');
    localStorage.removeItem("token")
    localStorage.removeItem("customer_code")
    this.router.navigate(['/login'])
  }

  active = [];

  outputEvent(active: any) {
    this.active = active;
  }
}
