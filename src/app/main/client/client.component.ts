import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  checktoken = () => {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
    }
  }

  constructor(public router: Router, private service: ApiService) { }

  getcustomersdata = []
  getcustomers() {
    this.service.getallcustomers().subscribe({
      next: (res) => {
        this.getcustomersdata.push(res)
      },
      error: (err) => {
        // localStorage.removeItem('customer_code')
        // localStorage.removeItem('token')
        // alert('로그인이 만료되었습니다. 로그인창으로 이동합니다')
        // this.router.navigate(['/login']);
      },
      complete: () => {
      }
    });
  }

  ngOnInit() {
    this.checktoken();
    setTimeout(() => {
      this.getcustomers()
    }, 500)
  }

}
