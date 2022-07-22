import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidefooter',
  templateUrl: './sidefooter.component.html',
  styleUrls: ['./sidefooter.component.css'],
})
export class SidefooterComponent implements OnInit {
  public Amodal: boolean = false;
  constructor(public router: Router) {}

  ngOnInit(): void {}

  clickedModalClose() {
    this.Amodal = false;
  }
  clickedModal() {
    this.Amodal = true;
  }

  token = sessionStorage.getItem('token');
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
