import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  token = sessionStorage.getItem('token');
  myname = '';
  corplogo;

  constructor(
    public router: Router,
    private service: ApiService,
    public dialog: MatDialog
  ) {}

  // 팝업창열기
  openDialog(): void {
    const dialogRef = this.dialog.open(ProfilemodalComponent, {
      width: '600px',
      height: '800px',
    });
  }

  currentusercheck() {
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          this.myname = res['name'];
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }

  // 로고이미지
  getonecustomerslogo(res) {
    const temp = [this.token, res.customerCode];
    this.service.getoncustomerslogo(temp).subscribe({
      next: (res) => {
        this.corplogo = res['logo'];
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  ngOnInit() {
    this.currentusercheck().then((res) => {
      this.getonecustomerslogo(res);
    });
  }
}

@Component({
  selector: 'app-profilemodal',
  templateUrl: 'profilemodal.component.html',
  styleUrls: ['../../popup.css'],
})
export class ProfilemodalComponent implements OnInit {
  passwordhide = true;
  passwordconfirmhide = true;

  Form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProfilemodalComponent>,
    public router: Router,
    private service: ApiService
  ) {}

  ngOnInit() {
    this.Form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      name: new FormControl(''),
      phone: new FormControl('', [
        // Validators.required,
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(10),
        Validators.maxLength(11),
      ]),
      passwordGroup: new FormGroup(
        {
          password: new FormControl('', [Validators.required]),
          passwordconfirm: new FormControl('', [Validators.required]),
        },
        this.equalValidator
      ),
    });
    this.currentuserck();
  }

  //사용자 정보[ID,NAME.PHONE]
  currentuserck() {
    const token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(token).subscribe({
        next: (res) => {
          this.Form.patchValue({
            username: res.username,
            name: res.name,
            phone: res.phone,
          });
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }

  // 비밀번호 유효성검사
  equalValidator({ value }: FormGroup): { [key: string]: any } {
    const [first, ...rest] = Object.keys(value || {});
    if (first.length == 0 && rest.length == 0) {
      return;
    } else {
      const valid = rest.every((v) => value[v] === value[first]);
      return valid ? null : { equal: true };
    }
  }

  // 저장
  submit() {
    const temp = [];

    const data = this.Form.value;
    data.password = data.passwordGroup.password;
    delete data.passwordGroup;

    temp.push(data.username);
    temp.push(data);

    this.service.modifyoneuser(temp).subscribe({
      next: (res) => {},
      error: (err) => {
        alert('내부 서버 에러.');
        this.Form.reset();
      },
      complete: () => {
        alert('정보 수정이 완료되었습니다');
        this.Form.reset();
        this.dialogRef.close();
      },
    });
  }

  //닫기
  onNoClick(): void {
    this.dialogRef.close();
  }
}
