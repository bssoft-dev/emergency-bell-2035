import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public router: Router) {}

  ngOnInit() {}

  logout(){
    console.log('안녕하세요')
    localStorage.removeItem("token")
    this.router.navigate(['/login'])
  }
}
