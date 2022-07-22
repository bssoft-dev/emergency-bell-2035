import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  token = '';
  customer_code = '';
  is_hyperuser;
  corplogo;
  modal = false;

  constructor(public router: Router, private service: ApiService) {}

  clickeModal() {
    this.modal = true;
  }

  currentusercheckdata = [];
  currentusercheck() {
    this.token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          this.token = sessionStorage.getItem('token');
          this.customer_code = res.customerCode;
          this.is_hyperuser = res.is_hyperuser;
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }

  getonecustomerslogo(res) {
    const temp = [sessionStorage.getItem('token'), res.customerCode];
    this.service.getoncustomerslogo(temp).subscribe({
      next: (res) => {
        this.corplogo = res['logo'];
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  myname = '';

  ngOnInit() {
    this.token = sessionStorage.getItem('token');
    this.currentusercheck().then((res) => {
      this.myname = res['name'];
      this.getonecustomerslogo(res);
    });
  }
}
