import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  user;

  credential= {
    email: '',
    password: ''
  }

  constructor(public as: AuthService, public router: Router, private service:ApiService) { 
  }

  ngOnInit(): void{
    this.loginForm = new FormGroup({
      'username': new FormControl("", [Validators.required, Validators.email]),
      'password': new FormControl("", [Validators.required,Validators.minLength(2),]),
    });
  }

  login(){
    const change = this.loginForm.value.username.replace('@','%40')
    console.log(change,'체인지')
    let king = `username=${change}&password=${this.loginForm.value.password}`
    console.log(king)
    if(this.loginForm.valid){
      try{
        this.service.login(king).subscribe((res)=>{
          console.log('res', res);
          if(res.length > 0){
            this.loginForm.reset();
            this.user = res[0]
            this.service.setCurrentUser(this.user)
            //this.router.navigate(["/"]);
            this.router.navigateByUrl('/');
          } else {
            localStorage.setItem('currentUser',null)
          }
        });
      } catch(error){
        console.log("로그인통신에러", error)
      }
    }else{
      console.log('all field is required')
    }
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

  gotodash(){
    this.router.navigateByUrl('/');

  }

}
