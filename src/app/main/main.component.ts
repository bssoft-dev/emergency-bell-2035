import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

import { SIDES } from './mock-side';
import { Sidebar } from './main';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  sides = SIDES;
  selectedSide?: Sidebar;

  constructor(public router: Router, private service: ApiService) {
    this.currentusercheck();
  }

  ngOnInit(): void {}

  token = '';
  customer_code = '';
  is_hyperuser;
  corplogo;

  currentItem = '전체현황';

  addItem(newItem: string) {
    this.currentItem = newItem;
  }
  
  currentusercheck() {
    this.token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          console.log('res : ', res);
          this.token = sessionStorage.getItem('token');
          this.customer_code = res.customerCode;
          this.is_hyperuser = res.is_hyperuser;
          console.log('customer_code : ', this.customer_code);

          console.log('is_hyperuser : ', this.is_hyperuser);
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }
}
