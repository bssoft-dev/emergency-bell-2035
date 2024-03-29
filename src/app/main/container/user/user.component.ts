import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

export interface DialogData {
  token: string;
  index: [];
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['../container.table.css', './user.component.css'],
})
export class UserComponent implements OnInit {
  @Input() userLog = [];
  token = sessionStorage.getItem('token');
  manangerDisabled: boolean; // 관리자권한 제어
  isHyperUser: boolean;

  displayedColumns = [
    'username',
    'customerName',
    'name',
    'phone',
    'email',
    'createTime',
    'manager',
  ];
  hyperColumns = [
    'username',
    'customerName',
    'name',
    'phone',
    'email',
    'createTime',
    'manager',
    'change',
  ]

  dataSource = []; // 회원데이터

  constructor(private service: ApiService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.dataList();
  }

  dataList() {
    return new Promise(() => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          this.isHyperUser = res.is_hyperuser;
          this.manangerDisabled = res.is_hyperuser || res.is_superuser;

          const temp = [this.token, res.customerCode];
          if(this.manangerDisabled) {
            this.service.getallusers(temp).subscribe({
              next: (res) => {
                this.dataSource = res;
              },
            });
          }
        },
      });
    });
  }

  //등록
  clickedaddModal() {
    const dialogRef = this.dialog.open(AdduserComponent, {
      width: '600px',
      height: '1040px',
      data: {
        token: this.token,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.dataList();
    });
  }

  // 수정
  clickedregModal(index) {
    const dialogRef = this.dialog.open(ReguserComponent, {
      width: '600px',
      height: '800px',
      data: {
        token: this.token,
        index: index,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.dataList();
    });
  }

  // 삭제
  deletedata(index) {
    console.log(index)
    if (index['username']) {
      const returnValue = confirm(
        index['username'] + ' 회원을 삭제 하시겠습니까?'
      );
      if (returnValue) {
        this.service.getcurrentuser(this.token).subscribe({
          next: (res) => {
            if (!res.is_hyperuser) {
              alert('회원 정보 삭제 권한이 없습니다.');
            }else {
              this.service.deleteoneuser(index['username']).subscribe({
                next: (res) => {
                  alert('회원 삭제가 완료되었습니다');
                  this.dataList();
                },
                error: (err) => {
                  alert('회원 삭제를 처리하는 도중 문제가 발생했습니다.');
                },
              });
            }
          },
          error: (err) => {
            alert('서버 에러');
          },
        });
      }
    } else {
    }
  }

  // 관리자권한
  checkManager(index, event: MatSlideToggleChange) {
    const modifySuperuser = () => {
      const temp = [];
      const jsontemp = {
        is_superuser: index.is_superuser,
      };
      temp.push(index.username);
      temp.push(jsontemp);
      this.service.usersupergrant(temp).subscribe({});
    }
    this.service.getcurrentuser(this.token).subscribe({
      next: (res) => {
        if (!res.is_superuser) {
          alert('관리자 권한 수정 권한이 없습니다.');
        }else {
          if(index.username === res.username) {
            const confirmData = confirm('관리자 권한을 제거하면 회원관리 조회 및 알람 설정을 할 수 없습니다.\n정말로 제거하시겠습니까?')
            if(confirmData) {
              modifySuperuser();
              this.router.navigate(['/main/dashboard']);
              // const usermenu = document.getElementById('회원관리');
              // usermenu.style.display = 'none';
            } else {
              event.source.checked = true; // 관리자 권한 유지
            }
          } else {
            modifySuperuser();
          }
        }
      },
      error: (err) => {
        alert('서버 에러');
      },
      complete: () => {},
    });
  }
}

// 등록 기능
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['../../popup.css', './user.component.css'],
})
export class AdduserComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AdduserComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _snackBar: MatSnackBar
  ) {}
  hide = true; // 비밀번호 표시
  Form: FormGroup;

  ngOnInit(): void {
    this.initGetCustomerNames();
    this.Form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      name: new FormControl(''),
      customerName: new FormControl(null, [Validators.required]),
      // customerName: new FormControl(''),
      phone: new FormControl('', [
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(10),
        Validators.maxLength(11),
      ]),
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
    });
  }

  //비밀번호 유효성검사
  equalPassword({ value }: FormGroup): { [key: string]: any } {
    const [first, ...regt] = Object.keys(value || {});
    if (first.length == 0 && regt.length == 0) {
      return;
    } else {
      const valid = regt.every((v) => value[v] === value[first]);
      return valid ? null : { equal: true };
    }
  }

  NonCheck = true;
  errorIdMsg = false;
  passIdMsg = false;

  // ID 중복검사
  idCheck() {
    const data = this.Form.controls.username.value;
    if (data.length > 0) {
      this.service.duplicatecheck(data).subscribe({
        next: (res) => {
          if (res == '생성 가능한 아이디 입니다') {
            this.NonCheck = false;
            this.passIdMsg = true;
            this.errorIdMsg = false;
          } else {
            this.NonCheck = false;
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
  submit() {
    const data = this.Form.value;
    data.password = data.passwordGroup.password;
    delete data.passwordGroup;
    if (data.customerName === null) {
      delete data.customerName;
      data.customerName = '';
    }
    if (this.Form.valid && this.passIdMsg) {
      this.service.registeruser(data).subscribe({
        next: (res) => {
          alert('등록이 완료 되었습니다');
        },
        error: (err) => {
          console.log(err)
          alert('등록 권한이 없습니다');
        },
        complete: () => {
          this.onNoClick();
        },
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
  selector: 'app-reguser',
  templateUrl: './reguser.component.html',
  styleUrls: ['../../popup.css', './user.component.css'],
})
export class ReguserComponent implements OnInit {
  token = sessionStorage.getItem('token');
  constructor(
    public dialogRef: MatDialogRef<ReguserComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _snackBar: MatSnackBar
  ) {}
  hide = true;
  index = this.data.index;
  Form: FormGroup;

  ngOnInit(): void {
    this.Form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      name: new FormControl(''),
      customerName: new FormControl(''),
      phone: new FormControl('', [
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(10),
        Validators.maxLength(11),
      ]),
      email: new FormControl('')
    });
    this.getOneUser();
  }

  //비밀번호 유효성검사
  equalPassword({ value }: FormGroup): { [key: string]: any } {
    const [first, ...regt] = Object.keys(value || {});
    if (first.length == 0 && regt.length == 0) {
      return;
    } else {
      const valid = regt.every((v) => value[v] === value[first]);
      return valid ? null : { equal: true };
    }
  }

  // 사용자정보
  getOneUser() {
    this.Form.patchValue({
      username: this.index['username'],
      name: this.index['name'],
      customerName: this.index['customerName'],
      phone: this.index['phone'],
      email: this.index['email'],
    });
  }

  // 수정
  submit() {
    // const jsontemp = {
    //   username: this.form.value.username,
    //   name: this.form.value.name,
    //   customerName: this.form.value.customerName,
    //   phone: this.form.value.phone,
    //   email: this.form.value.email,
    //   password: this.form.value.passwordGroup.password,
    // };
    
    const temp = this.Form.value;
    console.log(temp);
    delete temp.passwordGroup;
    const data = [temp['username'], temp];
    if (data) {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          if (!res.is_hyperuser) {
            alert('회원 정보 수정 권한이 없습니다.');
          }else {
            this.service.modifyoneuser(data).subscribe({
              next: (res) => {
                alert('회원 정보 수정이 완료 되었습니다');
              },
              error: (err) => {
                alert('회원 정보 수정을 처리하는 도중 문제가 발생했습니다.');
              },
              complete: () => {
                this.onNoClick();
              },
            });
          }
        },
        error: (err) => {
          alert('서버 에러');
        },
        complete: () => {
          this.onNoClick();
        },
      });
    }
  }

  // 돌아가기
  onNoClick(): void {
    this.dialogRef.close();
  }
}
