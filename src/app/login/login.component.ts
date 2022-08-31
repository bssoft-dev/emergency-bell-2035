import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  Form: FormGroup;

  constructor(
    public router: Router,
    private service: ApiService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['/main/dashboard']);
    }
    this.Form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    const change = this.Form.value.username.replace('@', '%40');
    let king = `username=${change}&password=${this.Form.value.password}`;

    if (this.Form.valid) {
      this.service.login(king).subscribe({
        next: (res) => {
          sessionStorage.setItem('token', res.access_token);
          this.Form.reset();
          this.router.navigate(['/main/dashboard']);
        },
        error: (err) => {
          alert('존재하지 않는 아이디이거나 패스워드가 다릅니다');
        },
        complete: () => {},
      });
    } else {
      alert('아이디와 패스워드를 확인해주세요');
    }
  }

  goforgotpassword() {
    const dialogRef = this.dialog.open(forgotpasswordComponent, {
      width: '750px',
      height: '450px',
    });
    dialogRef.afterClosed();
  }
}

// 등록 기능
@Component({
  selector: 'app-forgotpasswordComponent',
  templateUrl: './forgotpassword.component.html',
  styleUrls: [],
})
export class forgotpasswordComponent implements OnInit {
  Form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<forgotpasswordComponent>,
    private service: ApiService,
    private _snackBar: MatSnackBar
  ) {}
  hide = true; // 비밀번호 표시
  form: FormGroup;

  ngOnInit() {
    this.Form = new FormGroup({
      username: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    const data = this.Form.value;
    if (this.Form.valid) {
      this.service.forgotpassword(data).subscribe({
        next: (res) => {
          alert(
            '비밀번호 초기화 URL이 문자로 발송되었습니다. 이메일을 확인해주세요'
          );
        },
        error: (err) => {
          alert('서버 에러');
        },
        complete: () => {},
      });
    } else {
      alert('필수 항목을 입력해 주세요');
    }
  }
}
