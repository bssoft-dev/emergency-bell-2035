import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credential= {
    email: '',
    password: ''
  }

  constructor(public as: AuthService, public router: Router) { 
  }

  ngOnInit() {
    
  }

  loginWithGoogle(){
    this.as.googleLogin()
    /* .then(() => console.log("success"))
    .catch(error => console.log(error)); */
  }

  loginWithEmail(){
    console.log(this.credential);
    this.as.loginWithEmail(this.credential.email, this.credential.password)
    .then(() => {
      console.log("success");
      this.router.initialNavigation();
      console.log(this.router.url);
      console.log(">>> router", this.router)
      this.router.navigate(['/main/dashboard']);
    })
    .catch(error => console.log(error));
    
  }

}
