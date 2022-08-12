import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  token: string;
  index: [];
}

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css', '../container.component.css'],
})
export class MemberComponent implements OnInit {
  token = sessionStorage.getItem('token');
  manangerDisabled: boolean;

  constructor(private service: ApiService, public dialog: MatDialog) {}

  datalist = []; // 사용자데이터
  dataList() {
    this.datalist = [];
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          resolve(res);
          if (res.is_hyperuser || res.is_superuser) {
            this.manangerDisabled = true;
          } else {
            this.manangerDisabled = false;
          }
          const temp = [this.token, res.customerCode];
          this.service.getallusers(temp).subscribe({
            next: (res) => {
              this.datalist.push(res);
            },
            error: (err) => {},
            complete: () => {},
          });
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }

  //등록
  clickedaddModal() {
    const dialogRef = this.dialog.open(AddmemberComponent, {
      width: '750px',
      height: '1100px',
      data: {
        token: this.token,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.dataList();
    });
  }

  // 수정
  clickedregModal(index) {
    const dialogRef = this.dialog.open(ResmemberComponent, {
      width: '750px',
      height: '1100px',
      data: {
        token: this.token,
        index: index,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.dataList();
    });
  }

  // 삭제
  deletedata(index) {
    const returnValue = confirm(
      index['username'] + ' 회원을 삭제 하시겠습니까?'
    );
    if (returnValue) {
      this.service.deleteonedevice(index['username']).subscribe({
        next: (res) => {
          alert('삭제 완료');
          this.dataList();
        },
        error: (err) => {
          alert('삭제 실패');
        },
        complete: () => {},
      });
    }
  }

  // 관리자권한
  checkManager(index) {
    const temp = [];
    const jsontemp = {
      is_superuser: index.is_superuser,
    };
    temp.push(index.username);
    temp.push(jsontemp);
    this.service.usersupergrant(temp).subscribe({
      next: (res) => {},
      error: (err) => {},
      complete: () => {},
    });
  }

  ngOnInit(): void {
    this.dataList();
  }
}

// 등록 기능
@Component({
  selector: 'app-addmember',
  templateUrl: './addmember.component.html',
  styleUrls: ['./member.component.css', '../container.component.css'],
})
export class AddmemberComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddmemberComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  hide = true; // 비밀번호 표시
  form: FormGroup;

  ngOnInit(): void {
    this.initGetCustomerNames();
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      name: new FormControl(''),
      customerName: new FormControl(null, [Validators.required]),
      phone: new FormControl(''),
      email: new FormControl(''),
      passwordGroup: new FormGroup(
        {
          password: new FormControl('', [Validators.required]),
          passwordconfirm: new FormControl('', [Validators.required]),
        },
        this.equalPassword
      ),
    });
  }

  customerNames = []; // 고객사명
  initGetCustomerNames() {
    this.customerNames = [];
    this.service.getCustomerNames(this.data.token).subscribe({
      next: (res) => {
        this.customerNames = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  //비밀번호 유효성검사
  equalPassword({ value }: FormGroup): { [key: string]: any } {
    const [first, ...rest] = Object.keys(value || {});
    if (first.length == 0 && rest.length == 0) {
      return;
    } else {
      const valid = rest.every((v) => value[v] === value[first]);
      return valid ? null : { equal: true };
    }
  }

  errorIdMsg = false;
  passIdMsg = false;
  // input focus??
  usernamechange(e) {
    this.passIdMsg = false;
  }
  
  // ID 중복검사
  idCheck() {
    const data = this.form.controls.username.value;
    if (data.length > 0) {
      this.service.duplicatecheck(data).subscribe({
        next: (res) => {
          if (res == '생성 가능한 아이디 입니다') {
            this.passIdMsg = true;
            this.errorIdMsg = false;
          } else {
            this.passIdMsg = false;
            this.errorIdMsg = true;
          }
        },
        error: (err) => {
          alert('서버 에러');
        },
        complete: () => {},
      });
    }
  }

  // 등록
  formSubmit() {
    const data = this.form.value;
    data.password = data.passwordGroup.password;
    delete data.passwordGroup;
    if (data.customerName === null) {
      delete data.customerName;
      data.customerName = '';
    }
    if (this.form.valid) {
      this.service.registeruser(data).subscribe({
        next: (res) => {
          alert('회원 등록 완료');
        },
        error: (err) => {
          alert('권한 에러');
        },
        complete: () => {},
      });
    }
  }

  // 돌아가기
  onNoClick(): void {
    this.dialogRef.close();
  }
}

// 편집 기능
@Component({
  selector: 'app-resmember',
  templateUrl: './resmember.component.html',
  styleUrls: ['./member.component.css'],
})
export class ResmemberComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ResmemberComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  hide = true;
  index = this.data.index;
  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      name: new FormControl(''),
      customerName: new FormControl(null, [Validators.required]),
      phone: new FormControl(''),
      email: new FormControl(''),
      passwordGroup: new FormGroup(
        {
          password: new FormControl('', [Validators.required]),
          passwordconfirm: new FormControl('', [Validators.required]),
        },
        this.equalPassword
      ),
    });
    this.getOneDevice();
  }

  //비밀번호 유효성검사
  equalPassword({ value }: FormGroup): { [key: string]: any } {
    const [first, ...rest] = Object.keys(value || {});
    if (first.length == 0 && rest.length == 0) {
      return;
    } else {
      const valid = rest.every((v) => value[v] === value[first]);
      return valid ? null : { equal: true };
    }
  }

  // 사용자정보
  getOneDevice() {
    this.form.patchValue({
      username: this.index['username'],
      name: this.index['name'],
      customerName: this.index['customerName'],
      phone: this.index['phone'],
      email: this.index['email'],
    });
  }

  // 수정
  formSubmit() {
    const data = [this.index['username'], this.form.value];
    if (this.form.valid) {
      this.service.modifyonedevice(data).subscribe({
        next: (res) => {
          alert('수정완료');
        },
        error: (err) => {
          alert('수정 실패');
        },
        complete: () => {},
      });
    }
  }

  // 돌아가기
  onNoClick(): void {
    this.dialogRef.close();
  }
}
