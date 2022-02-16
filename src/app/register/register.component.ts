import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  credential = {
    email: '',
    password: ''
  }
  
  constructor(public authService: AuthService, public router: Router) { 
  }

  ngOnInit() {
  }

  registerUser(){
    console.log(this.credential);
    console.log(this.authService.addUser(this.credential));
    //this.db.list('users').update(this.authService.currentUser().uid, this.authService.currentUser());
    this.router.navigate(['/main/dashboard']);
  }
  
  gologin(){
    this.router.navigate(['/login']);
  }
}
