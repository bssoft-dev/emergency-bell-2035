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
  token = '';
  customer_code = '';
  is_hyperuser;
  corplogo;
  modal = false;

  constructor(
    public router: Router,
    private service: ApiService,
    public dialog: MatDialog
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ProfilemodalComponent, {
      width: '693px',
      height: '945px',
    });
  }

  currentusercheck() {
    this.token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          this.token = sessionStorage.getItem('token');
          this.customer_code = res.customerCode;
          this.is_hyperuser = res.is_hyperuser;
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }

  getonecustomerslogo(res) {
    const temp = [sessionStorage.getItem('token'), res.customerCode];
    this.service.getoncustomerslogo(temp).subscribe({
      next: (res) => {
        this.corplogo = res['logo'];
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  myname = '';

  ngOnInit() {
    this.token = sessionStorage.getItem('token');
    this.currentusercheck().then((res) => {
      this.myname = res['name'];
      this.getonecustomerslogo(res);
    });
  }
}

@Component({
  selector: 'app-profilemodal',
  templateUrl: 'profilemodal.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfilemodalComponent implements OnInit {
  passwordhide = true;
  passwordconfirmhide = true;

  modifyuserForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ProfilemodalComponent>,
    public router: Router,
    private service: ApiService
  ) {}

  ngOnInit() {
    this.modifyuserForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      name: new FormControl(''),
      phone: new FormControl(''),
      passwordGroup: new FormGroup(
        {
          password: new FormControl('', [Validators.required]),
          passwordconfirm: new FormControl('', [Validators.required]),
        },
        this.equalValidator
      ),
    });
    this.currentuserck().then((res) => {
      this.patchvalue(res);
    });
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
        complete: () => {},
      });
    });
  }

  //정보 불러오기[ID,NAME.PHONE]
  patchvalue(res) {
    this.modifyuserForm.patchValue({
      username: res.username,
      name: res.name,
      phone: res.phone,
    });
  }

  equalValidator({ value }: FormGroup): { [key: string]: any } {
    const [first, ...rest] = Object.keys(value || {});
    if (first.length == 0 && rest.length == 0) {
      return;
    } else {
      const valid = rest.every((v) => value[v] === value[first]);
      return valid ? null : { equal: true };
    }
  }

  modifyoneUser() {
    const temp = [];

    const data = this.modifyuserForm.value;
    data.password = data.passwordGroup.password;
    delete data.passwordGroup;

    temp.push(data.username);
    temp.push(data);

    this.service.modifyoneuser(temp).subscribe({
      next: (res) => {
        alert('정보 수정이 완료되었습니다');
        this.modifyuserForm.reset();
        this.router.navigate(['/login']);
        this.dialogRef.close();
      },
      error: (err) => {
        alert('내부 서버 에러.');
        this.modifyuserForm.reset();
        this.router.navigate(['/login']);
      },
      complete: () => {},
    });
  }

  get f() {
    return this.modifyuserForm.controls;
  }

  //모달 닫기
  onNoClick(): void {
    this.dialogRef.close();
  }
}
