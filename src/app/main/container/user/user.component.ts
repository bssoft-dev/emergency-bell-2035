import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  NgControl,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  MAT_FORM_FIELD,
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { Subject } from 'rxjs';

export interface DialogData {
  token: string;
  index: [];
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css', '../container.component.css'],
})
export class UserComponent implements OnInit {
  token = sessionStorage.getItem('token');
  manangerDisabled: boolean; // 관리자권한 제어

  constructor(private service: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataList();
  }

  datalist = []; // 사용자데이터
  dataList() {
    this.datalist = [];
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (reg) => {
          resolve(reg);
          if (reg.is_hyperuser || reg.is_superuser) {
            this.manangerDisabled = true;
          } else {
            this.manangerDisabled = false;
          }
          const temp = [this.token, reg.customerCode];
          this.service.getallusers(temp).subscribe({
            next: (reg) => {
              this.datalist.push(reg);
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
    const dialogRef = this.dialog.open(AdduserComponent, {
      width: '750px',
      height: '1100px',
      data: {
        token: this.token,
      },
    });
    dialogRef.afterClosed().subscribe((regult) => {
      this.dataList();
    });
  }

  // 수정
  clickedregModal(index) {
    const dialogRef = this.dialog.open(ReguserComponent, {
      width: '750px',
      height: '1100px',
      data: {
        token: this.token,
        index: index,
      },
    });
    dialogRef.afterClosed().subscribe((regult) => {
      this.dataList();
    });
  }

  // 삭제
  deletedata(index) {
    const returnValue = confirm(
      index['username'] + ' 회원을 삭제 하시겠습니까?'
    );
    if (returnValue) {
      this.service.deleteoneuser(index['username']).subscribe({
        next: (reg) => {
          alert('삭제 완료');
          this.dataList();
        },
        error: (err) => {
          alert('삭제 실패');
        },
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
    this.service.usersupergrant(temp).subscribe({});
  }
}

// 등록 기능
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./user.component.css', '../container.component.css'],
})
export class AdduserComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AdduserComponent>,
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
      next: (reg) => {
        this.customerNames = reg;
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
        next: (reg) => {
          if (reg == '생성 가능한 아이디 입니다') {
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
        next: (reg) => {
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
  selector: 'app-reguser',
  templateUrl: './reguser.component.html',
  styleUrls: ['./user.component.css'],
})
export class ReguserComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ReguserComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  hide = true;
  index = this.data.index;
  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
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
        this.equalPassword
      ),
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
    const jsontemp = {
      username: this.form.value.username,
      name: this.form.value.name,
      customerName: this.form.value.customerName,
      phone: this.form.value.phone,
      email: this.form.value.email,
      password: this.form.value.passwordGroup.password,
    };
    const data = [this.index['username'], jsontemp];
    if (this.form.valid) {
      this.service.modifyoneuser(data).subscribe({
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
