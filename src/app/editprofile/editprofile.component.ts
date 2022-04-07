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
  registeruserForm: FormGroup;
  overlapcheckstate = false;
  submitted = false;

  constructor(public router: Router, private service: ApiService) {
  }

  equalValidator({ value }: FormGroup): { [key: string]: any } {
    const [first, ...rest] = Object.keys(value || {});
    if (first.length == 0 && rest.length == 0) {
      return
    } else {
      const valid = rest.every(v => value[v] === value[first]);
      return valid ? null : { equal: true };
    }
  }

  ngOnInit() {
    this.registeruserForm = new FormGroup({
      'customerCode': new FormControl("",),
      'username': new FormControl("", [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      'name': new FormControl("",),
      'phone': new FormControl("",),
      'email': new FormControl("",),
      'passwordGroup': new FormGroup({
        'password': new FormControl("", [Validators.required]),
        'passwordconfirm': new FormControl("", [Validators.required,]),
      }, this.equalValidator)
    });
  }

  get f() { return this.registeruserForm.controls; }

  registerUser() {
    this.submitted = true;
    const data = this.registeruserForm.value
    data.password = data.passwordGroup.password
    delete data.passwordGroup;
    if (this.registeruserForm.valid) {
      this.service.registeruser(data).subscribe({
        next: (res) => {
          alert('회원가입이 성공적으로 완료되었습니다 로그인 창으로 이동합니다.')
          this.gologin()
        },
        error: (err) => {
          alert('서버 에러')
        },
        complete: () => {
        }
      });
    } else {
      alert('입력을 확인해주세요')
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