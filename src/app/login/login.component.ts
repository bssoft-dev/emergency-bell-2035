import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  message: any;

  subscription: Subscription;
  constructor(public router: Router, private service: ApiService) {

  }

  ngOnInit(): void {
    if (sessionStorage.getItem("token")) {
      this.router.navigate(['/main/dashboard']);
    }
    this.loginForm = new FormGroup({
      'email': new FormControl("", [Validators.required]),
      'password': new FormControl("", [Validators.required, Validators.minLength(2),]),
    });
  }

  login() {
    const change = this.loginForm.value.email.replace('@', '%40')
    let loggquery = `email=${change}&password=${this.loginForm.value.password}`
    sessionStorage.setItem('email', this.loginForm.value.email)


    if (this.loginForm.valid) {
      this.service.login(loggquery).subscribe({
        next: (res) => {
          sessionStorage.setItem('is_hyperuser', res['is_hyperuser'])
          sessionStorage.setItem('customer_code', res.customer_code);
          sessionStorage.setItem("token", res.access_token);
          this.loginForm.reset();
          this.router.navigate(['/main/dashboard']);
        },
        error: (err) => {
          alert('존재하지 않는 아이디이거나 패스워드가 다릅니다')
        },
        complete: () => {
        }
      });
    } else {
      alert('아이디와 패스워드를 확인해주세요')
    }
  }

  goregister() {
    this.router.navigate(['/register']);
  }
  goforgotpassword() {
    this.router.navigate(['/forgotpassword'])
  }


}
