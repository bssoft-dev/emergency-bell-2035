import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user;

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

    function alarm(e){
    if(e=="The email address is badly formatted."){
          alert("아이디가 존재하지 않습니다.")
    }
    else if(e=="The password is invalid or the user does not have a password."){
          alert("비밀번호가 다릅니다.")
      }
    }
    // console.log(this.credential);
    // console.log(this.user.email);
    this.as.loginWithEmail(this.credential.email, this.credential.password)
    .then(() => {
      console.log("success");
      this.router.initialNavigation();
      console.log(this.router.url);
      console.log(">>> router", this.router)
      this.router.navigate(['/main/dashboard']);
    })
    .catch(error => alarm(error.message));
  }

}
