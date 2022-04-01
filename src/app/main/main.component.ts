import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  token = "";
  customer_code = "";

  constructor(public router: Router, private service: ApiService) { }

  is_hyperuser: any;
  corplogo: any;

  getonecustomerslogo() {
    const temp = [this.token, this.customer_code]
    this.service.getoncustomerslogo(temp).subscribe({
      next: (res) => {
        this.corplogo = res['logo']
      },
      error: (err) => {
      },
      complete: () => {
      }
    });
  }

  ngOnInit() {
    this.token = sessionStorage.getItem('token')
    this.customer_code = sessionStorage.getItem('customer_code')
    this.is_hyperuser = sessionStorage.getItem('is_hyperuser');
    this.getonecustomerslogo();
  }

  logout() {
    sessionStorage.removeItem('is_hyperuser');
    sessionStorage.removeItem('myname');
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
