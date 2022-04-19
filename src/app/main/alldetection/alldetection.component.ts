import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-alldetection',
  templateUrl: './alldetection.component.html',
  styleUrls: ['./alldetection.component.css']
})
export class AlldetectionComponent implements OnInit {

  constructor(private service: ApiService) { }

  getcurrentuserdata = [];
  getcurrentuser() {
    const token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(token).subscribe({
        next: (res) => {
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {
        }
      })
    })
  }

  alldetectiondata = [];
  alldetection(res) {
    const customer_code = res.customerCode;
    this.service.alldetection(customer_code).subscribe({
      next: (res) => {
        this.alldetectiondata.push(res)
      },
      error: (err) => {

      },
      complete: () => {
      }
    });
  }

  ngOnInit(): void {
    this.getcurrentuser().then(res => {
      this.alldetection(res);
    })

  }
}

