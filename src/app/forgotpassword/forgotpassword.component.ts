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
      'username': new FormControl("", [Validators.required]),
    });
  }

  forgotpassword() {
    const data = this.forgotpasswordForm.value;
    console.log(data, 'll')
    if (this.forgotpasswordForm.valid) {
      this.service.forgotpassword(data).subscribe({
        next: (res) => {
          alert('비밀번호 초기화 URL이 문자로 발송되었습니다. 이메일을 확인해주세요')
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('서버 에러')
        },
        complete: () => {
        }
      });
    } else {
      alert('필수 항목을 입력해 주세요')
    }
  }

  gologin() {
    this.router.navigate(['/login']);
  }

}
