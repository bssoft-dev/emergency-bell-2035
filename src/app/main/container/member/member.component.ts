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
  customerNames: string[];
  registeruserForm: object;

  getallusersdata: [];
  cnt: number;

  username: string;
}

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css', '../container.component.css'],
})
export class MemberComponent implements OnInit {
  customer_code = '';
  token = sessionStorage.getItem('token');

  registeruserForm: FormGroup;
  event: any;

  constructor(private service: ApiService, public dialog: MatDialog) {}

  // 사용자 체크
  currentusercheck() {
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          resolve(res);
          this.customer_code = res.customerCode;
          console.log('설마? : ', res.is_hyperuser, res.is_superuser);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }

  // 데이터 불러오기
  getallusersdata = [];
  initgetallusers() {
    const temp = [this.token, this.customer_code];
    this.service.getallusers(temp).subscribe({
      next: (res) => {
        this.getallusersdata = res;
        console.log('getallusersdata', this.getallusersdata[0][1]);
        console.log('res', res);
      },
      error: (err) => {},
      complete: () => {},
    });
  }
  // 고객사명
  customerNames = [];
  initGetCustomerNames() {
    this.customerNames = [];
    this.service.getCustomerNames(this.token).subscribe({
      next: (res) => {
        this.customerNames = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  // 등록 팝업
  clickedaddModal() {
    const dialogRef = this.dialog.open(AddmemberComponent, {
      width: '750px',
      height: '1100px',
      data: {
        token: this.token,
        customerNames: this.customerNames,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('이것만돼라 : ', typeof result);
      console.log('이것만돼라 : ', result);
      this.initgetallusers();
    });
  }

  // 수정 팝업
  getOneUser(index) {
    const dialogRef = this.dialog.open(ResmemberComponent, {
      width: '750px',
      height: '1100px',
      data: {
        cnt: index,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.initgetallusers();
    });
  }

  // 삭제
  deleteoneUser(index) {
    const returnValue = confirm(
      this.getallusersdata[0][index]['username'] + ' 회원을 삭제 하시겠습니까?'
    );
    if (returnValue) {
      this.service
        .deleteoneuser(this.getallusersdata[0][index]['username'])
        .subscribe({
          next: (res) => {
            alert('삭제 완료');
            this.initgetallusers();
          },
          error: (err) => {
            alert('서버 에러');
          },
          complete: () => {},
        });
    }
  }
  ngOnInit() {
    this.currentusercheck().then((res) => {
      this.initgetallusers();
      this.initGetCustomerNames();
    });
  }
}

// 등록 기능
@Component({
  selector: 'app-addmember',
  templateUrl: 'addmember.component.html',
  styleUrls: ['./member.component.css'],
})
export class AddmemberComponent implements OnInit {
  hide = true; // 비밀번호 표시

  token = this.data.token;
  customerNames = this.data.customerNames;

  registeruserForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddmemberComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.registeruserForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      name: new FormControl(''),
      customerName: new FormControl(null, [Validators.required]),
      phone: new FormControl(''),
      email: new FormControl(''),
      passwordGroup: new FormGroup(
        {
          password: new FormControl('', [Validators.required]),
          passwordconfirm: new FormControl('', [Validators.required]),
        },
        this.equalValidator
      ),
    });
  }

  registerUser() {
    const data = this.registeruserForm.value;
    data.password = data.passwordGroup.password;
    delete data.passwordGroup;
    if (data.customerName === null) {
      delete data.customerName;
      data.customerName = '';
    }
    if (this.registeruserForm.valid) {
      this.service.registeruser(data).subscribe({
        next: (res) => {
          alert('회원 등록이 완료되었습니다');
          this.registeruserForm.reset();
        },
        error: (err) => {
          alert('권한이 없습니다.');
        },
        complete: () => {},
      });
    }
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

  errorIdMsg = false;
  passIdMsg = false;
  // input focus??
  usernamechange(e) {
    this.passIdMsg = false;
  }

  // 아이디 유효성검사
  duplicatecheck() {
    const data = this.registeruserForm.controls.username.value;
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

  // 팝업닫기
  onNoClick(): void {
    this.registeruserForm.reset();
    this.dialogRef.close();
  }
}

//회원편집 기능
@Component({
  selector: 'app-resmember',
  templateUrl: 'resmember.component.html',
  styleUrls: ['./member.component.css'],
})
export class ResmemberComponent implements OnInit {
  hide = true;

  modifyuserForm: FormGroup;
  is_hyperuser = false;
  is_superuser = false;
  token = '';
  customer_code = '';

  event: any;

  constructor(
    public dialogRef: MatDialogRef<ResmemberComponent>,
    private service: ApiService
  ) {}

  currentusercheck() {
    const token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(token).subscribe({
        next: (res) => {
          resolve(res);
          this.token = sessionStorage.getItem('token');
          this.customer_code = res.customerCode;
          this.is_superuser = res.is_superuser;
          this.is_hyperuser = res.is_hyperuser;
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }

  customerNames = [];
  initGetCustomerNames() {
    const temp = sessionStorage.getItem('token');
    this.customerNames = [];
    this.service.getCustomerNames(temp).subscribe({
      next: (res) => {
        this.customerNames = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  getallusersdata = [];
  initgetallusers(res) {
    const temp = [sessionStorage.getItem('token'), res.customerCode];
    this.getallusersdata = [];
    this.service.getallusers(temp).subscribe({
      next: (res) => {
        this.getallusersdata.push(res);
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  getallusers() {
    const temp = [this.token, this.customer_code];

    this.getallusersdata = [];
    this.service.getallusers(temp).subscribe({
      next: (res) => {
        this.getallusersdata.push(res);
      },
      error: (err) => {},
      complete: () => {},
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

  ngOnInit() {
    this.currentusercheck().then((res) => {
      this.initgetallusers(res);
    });
    this.initGetCustomerNames();

    this.modifyuserForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      name: new FormControl(''),
      customerName: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      passwordGroup: new FormGroup(
        {
          password: new FormControl('', [Validators.required]),
          passwordconfirm: new FormControl('', [Validators.required]),
        },
        this.equalValidator
      ),
    });
  }

  ngOnDestroy() {
    this.getoneuserdata = [];
  }

  passIdMsg = false;
  usernamechange(e) {
    this.passIdMsg = false;
  }

  modifymanager(index) {
    if (this.is_hyperuser || this.is_superuser) {
      this.getallusersdata[0][index].is_superuser =
        !this.getallusersdata[0][index].is_superuser;
      const temp = [];
      const jsontemp = {
        is_superuser: this.getallusersdata[0][index].is_superuser,
      };
      temp.push(this.getallusersdata[0][index].username);
      temp.push(jsontemp);
      this.service.usersupergrant(temp).subscribe({
        next: (res) => {},
        error: (err) => {},
        complete: () => {},
      });
    } else {
      alert('관리자 권한이 없습니다');
      this.getallusers();
    }
  }

  getoneuserdata = [];
  getOneUser(index) {
    if (this.is_hyperuser || this.is_superuser) {
      this.getoneuserdata = this.getallusersdata[0][index];

      this.modifyuserForm.patchValue({
        username: this.getoneuserdata['username'],
        name: this.getoneuserdata['name'],
        customerName: this.getoneuserdata['customerName'],
        phone: this.getoneuserdata['phone'],
        email: this.getoneuserdata['email'],
      });
    } else {
      alert('회원님은 관리자 권한이 없습니다');
      this.getallusers();
    }
  }

  deleteoneUser(index) {
    if (this.is_hyperuser || this.is_superuser) {
      const returnValue = confirm('회원을 삭제 하시겠습니까?');
      if (returnValue) {
        this.service
          .deleteoneuser(this.getallusersdata[0][index]['username'])
          .subscribe({
            next: (res) => {
              alert('삭제 완료');
              this.getallusers();
            },
            error: (err) => {
              alert('서버 에러');
            },
            complete: () => {},
          });
      }
    } else {
      alert('회원님은 관리자 권한이 없습니다');
      this.getallusers();
    }
  }

  cantmatch = '';
  modifyoneUser() {
    if (
      this.modifyuserForm.value.password !=
      this.modifyuserForm.value.passwordconfirm
    ) {
      this.cantmatch = '비밀번호가 일치하지 않습니다';
    } else {
      const temp = [];
      const jsontemp = {
        username: this.modifyuserForm.value.username,
        name: this.modifyuserForm.value.name,
        customerName: this.modifyuserForm.value.customerName,
        phone: this.modifyuserForm.value.phone,
        email: this.modifyuserForm.value.email,
        password: this.modifyuserForm.value.password,
      };
      temp.push(this.getoneuserdata['username']);
      temp.push(jsontemp);
      this.service.modifyoneuser(temp).subscribe({
        next: (res) => {
          alert('회원 수정이 완료되었습니다');
          this.getallusers();
          this.modifyuserForm.reset();
        },
        error: (err) => {},
        complete: () => {},
      });
    }
  }
  onNoClick(): void {
    this.modifyuserForm.reset();
    this.dialogRef.close();
  }
}
