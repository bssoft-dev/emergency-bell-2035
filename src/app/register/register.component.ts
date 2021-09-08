import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

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
  
  constructor(public authService: AuthService, public db:AngularFireDatabase, public router: Router) { 
  }

  ngOnInit() {
  }

  registerUser(){
    console.log(this.credential);
    console.log(this.authService.addUser(this.credential));
    //this.db.list('users').update(this.authService.currentUser().uid, this.authService.currentUser());
    this.router.navigate(['/main/dashboard']);
  }
/* 
  tryRegister(value){
    this.authService.doRegister(value)
    .then(res => {
      console.log(res);
      this.errorMessage = "";
      this.successMessage = "Your account has been created";
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = "";
    })
  }
 */
}
