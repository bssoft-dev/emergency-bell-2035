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
  modifyuserForm: FormGroup;
  overlapcheckstate = false;
  submitted = false;

  constructor(public router: Router, private service: ApiService) {
  }

  getoneuserdata;
  currentusercheck() {
    const token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(token).subscribe({
        next: (res) => {
          this.getoneuserdata = res;
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {
        }
      })
    })
  }

  patchvalue(res) {
    this.modifyuserForm.patchValue({
      username: res.username,
      name: res.name,
      phone: res.phone,
    })
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
    this.modifyuserForm = new FormGroup({
      'username': new FormControl("", [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      'name': new FormControl("",),
      'phone': new FormControl("",),
      'passwordGroup': new FormGroup({
        'password': new FormControl("", [Validators.required]),
        'passwordconfirm': new FormControl("", [Validators.required,]),
      }, this.equalValidator)
    });

    this.currentusercheck().then(res => {
      this.patchvalue(res)
    })
  }

  modifyoneUser() {
    const temp = []

    const data = this.modifyuserForm.value
    data.password = data.passwordGroup.password
    delete data.passwordGroup;

    temp.push(data.username)
    temp.push(data)
    console.log(temp, 'slslls')

    this.service.modifyoneuser(temp).subscribe({
      next: (res) => {
        alert('정보 수정이 완료되었습니다 전체현황 페이지로 이동합니다')
        this.modifyuserForm.reset()
        this.router.navigate(['/login']);
      },
      error: (err) => {

      },
      complete: () => {
      }
    });

  }

  get f() { return this.modifyuserForm.controls; }



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