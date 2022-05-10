import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [ './profile.component.css']
})
export class ProfileComponent implements OnInit {
  registeremailForm: FormGroup;
  registersmsForm: FormGroup;

  public modal : boolean = false;

  modifyuserForm: FormGroup;
  overlapcheckstate = false;
  submitted = false;

  constructor(
    public router: Router,
    private service: ApiService) {

  }

  ngOnInit() {

    this.modifyuserForm = new FormGroup({
      'username': new FormControl("", [Validators.required]),
      'name': new FormControl("",),
      'phone': new FormControl("",),
      'passwordGroup': new FormGroup({
        'password': new FormControl("", [Validators.required]),
        'passwordconfirm': new FormControl("", [Validators.required,]),
      }, this.equalValidator)
    });
    this.currentuserck().then(res => {
      this.patchvalue(res)
    })
  }

  clickeModal() {
    this.modal = true;
  }

  getoneuserdata;
  currentuserck() {
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

  modifyoneUser() {
    const temp = []

    const data = this.modifyuserForm.value
    data.password = data.passwordGroup.password
    delete data.passwordGroup;

    temp.push(data.username)
    temp.push(data)

    this.service.modifyoneuser(temp).subscribe({
      next: (res) => {
        alert('정보 수정이 완료되었습니다')
        this.modifyuserForm.reset()
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('내부 서버 에러.')
        this.modifyuserForm.reset()
        this.router.navigate(['/login']);
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
