import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  forgotpasswordForm: FormGroup;

  constructor(public router: Router, private service: ApiService) {
  }

  ngOnInit() {
    this.forgotpasswordForm = new FormGroup({
      'email': new FormControl("", [Validators.required]),
      'customerCode': new FormControl("", [Validators.required]),
      'name': new FormControl(""),
      'password': new FormControl("", [Validators.required, Validators.minLength(2),]),
      'confirmpassword': new FormControl("", [Validators.required, Validators.minLength(2),]),
    });
  }

  forgotpassword() {
    const data = this.forgotpasswordForm.value;
    if (this.forgotpasswordForm.valid) {
      if (this.forgotpasswordForm.value.password === this.forgotpasswordForm.value.confirmpassword) {
        // this.service.register(data).subscribe({
        //   next: (res) => {
        //     alert('회원가입이 성공적으로 완료되었습니다. 로그인창으로 이동합니다')
        //     this.router.navigate(['/login']);
        //   },
        //   error: (err) => {
        //     alert('서버에서 에러메세지 전달')
        //   },
        //   complete: () => {
        //   }
        // });
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

}
