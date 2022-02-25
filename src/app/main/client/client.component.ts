import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  constructor(public router: Router, private service: ApiService) { }

  getcustomersdata = []
  getcustomers() {
    this.service.getallcustomers().subscribe({
      next: (res) => {
        this.getcustomersdata.push(res)
        console.log(this.getcustomersdata, '영승')
      },
      error: (err) => {

      },
      complete: () => {
      }
    });
  }

  ngOnInit() {
    this.getcustomers()
  }

}
