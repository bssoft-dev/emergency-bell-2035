import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {
  registerForm: FormGroup;
  overlapcheckstate = false;

  constructor(public router: Router, private service: ApiService) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'username': new FormControl("", [Validators.required]),
      'email': new FormControl("",),
      'customerCode': new FormControl("", [Validators.required]),
      'name': new FormControl(""),
      'password': new FormControl("", [Validators.required, Validators.minLength(2),]),
      'confirmpassword': new FormControl("", [Validators.required, Validators.minLength(2),]),
    });
  }

  register() {
    const data = this.registerForm.value;
    if (this.registerForm.valid) {
      if (this.registerForm.value.password === this.registerForm.value.confirmpassword) {
        this.service.register(data).subscribe({
          next: (res) => {
            alert('회원가입이 성공적으로 완료되었습니다. 로그인창으로 이동합니다')
            this.router.navigate(['/login']);
          },
          error: (err) => {
            alert('서버에서 에러메세지 전달')
          },
          complete: () => {
          }
        });
      } else {
        alert('비밀번호가 다릅니다')
      }
    } else {
      alert('필수 항목을 입력해 주세요')
    }
  }

  gologin() {
    this.router.navigate(['/login']);
  }
  goforgotpassword() {
    this.router.navigate(['/forgotpassword'])
  }
  overlapcheck() {
    this.overlapcheckstate = !this.overlapcheckstate;
  }

}
