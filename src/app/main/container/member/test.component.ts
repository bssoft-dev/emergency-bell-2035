// import { Component, OnInit, Inject } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { ApiService } from 'src/app/services/api.service';
// import {
//   MatDialog,
//   MatDialogRef,
//   MAT_DIALOG_DATA,
// } from '@angular/material/dialog';

// export interface DialogData {
//   token: string;
//   getalldata: [];
//   cnt: number;
// }

// @Component({
//   selector: 'app-member',
//   templateUrl: './member.component.html',
//   styleUrls: ['./member.component.css', '../container.component.css'],
// })
// export class MemberComponent implements OnInit {
//   token = sessionStorage.getItem('token');

//   constructor(private service: ApiService, public dialog: MatDialog) {}

//   getalldata = []; // 사용자데이터
//   currentusercheck() {
//     this.getalldata = [];
//     return new Promise((resolve, reject) => {
//       this.service.getcurrentuser(this.token).subscribe({
//         next: (res) => {
//           resolve(res);
//           const temp = [this.token, res.customerCode];
//           this.service.getallusers(temp).subscribe({
//             next: (res) => {
//               this.getalldata.push(res);
//             },
//             error: (err) => {},
//             complete: () => {},
//           });
//         },
//         error: (err) => {
//           reject(new Error(err));
//         },
//         complete: () => {},
//       });
//     });
//   }

//   //등록 팝업
//   clickedaddModal() {
//     const dialogRef = this.dialog.open(AddmemberComponent, {
//       width: '750px',
//       height: '1100px',
//       data: {
//         token: this.token,
//       },
//     });
//     dialogRef.afterClosed().subscribe((result) => {
//       this.currentusercheck();
//     });
//   }

//   // 수정 팝업
//   clickedregModal(index) {
//     const dialogRef = this.dialog.open(ResmemberComponent, {
//       width: '750px',
//       height: '1100px',
//       data: {
//         token: this.token,
//         getalldata: this.getalldata[0][index],
//       },
//     });
//     dialogRef.afterClosed().subscribe((result) => {
//       this.currentusercheck();
//     });
//   }

//   // 삭제
//   deletedata(index) {
//     const returnValue = confirm(
//       this.getalldata[0][index]['username'] + ' 회원을 삭제 하시겠습니까?'
//     );
//     if (returnValue) {
//       this.service
//         .deleteonedevice(this.getalldata[0][index]['username'])
//         .subscribe({
//           next: (res) => {
//             alert('삭제 완료');
//             this.currentusercheck();
//           },
//           error: (err) => {
//             alert('삭제 실패');
//           },
//           complete: () => {},
//         });
//     }
//   }
//   ngOnInit(): void {
//     this.currentusercheck();
//   }
// }

// // 등록 기능
// @Component({
//   selector: 'app-addmember',
//   templateUrl: 'addmember.component.html',
//   styleUrls: ['./member.component.css', '../container.component.css'],
// })
// export class AddmemberComponent implements OnInit {
//   constructor(
//     public dialogRef: MatDialogRef<AddmemberComponent>,
//     private service: ApiService,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData
//   ) {}
//   hide = true; // 비밀번호 표시
//   form: FormGroup;

//   ngOnInit(): void {
//     this.initGetCustomerNames();
//     this.form = new FormGroup({
//       username: new FormControl(null, [Validators.required]),
//       name: new FormControl(''),
//       customerName: new FormControl(null, [Validators.required]),
//       phone: new FormControl(''),
//       email: new FormControl(''),
//       passwordGroup: new FormGroup(
//         {
//           password: new FormControl('', [Validators.required]),
//           passwordconfirm: new FormControl('', [Validators.required]),
//         },
//         this.equalPassword
//       ),
//     });
//   }

//   customerNames = []; // 고객사명
//   initGetCustomerNames() {
//     this.customerNames = [];
//     this.service.getCustomerNames(this.data.token).subscribe({
//       next: (res) => {
//         this.customerNames = res;
//       },
//       error: (err) => {},
//       complete: () => {},
//     });
//   }

//   //비밀번호 유효성검사
//   equalPassword({ value }: FormGroup): { [key: string]: any } {
//     const [first, ...rest] = Object.keys(value || {});
//     if (first.length == 0 && rest.length == 0) {
//       return;
//     } else {
//       const valid = rest.every((v) => value[v] === value[first]);
//       return valid ? null : { equal: true };
//     }
//   }

//   errorIdMsg = false;
//   passIdMsg = false;
//   // input focus??
//   usernamechange(e) {
//     this.passIdMsg = false;
//   }
//   idCheck() {
//     // ID 중복검사
//     const data = this.form.controls.username.value;
//     if (data.length > 0) {
//       this.service.duplicatecheck(data).subscribe({
//         next: (res) => {
//           if (res == '생성 가능한 아이디 입니다') {
//             this.passIdMsg = true;
//             this.errorIdMsg = false;
//           } else {
//             this.passIdMsg = false;
//             this.errorIdMsg = true;
//           }
//         },
//         error: (err) => {
//           alert('서버 에러');
//         },
//         complete: () => {},
//       });
//     }
//   }

//   // 등록
//   formSubmit() {
//     const data = this.form.value;
//     data.password = data.passwordGroup.password;
//     delete data.passwordGroup;
//     if (data.customerName === null) {
//       delete data.customerName;
//       data.customerName = '';
//     }
//     if (this.form.valid) {
//       this.service.registeruser(data).subscribe({
//         next: (res) => {
//           alert('회원 등록 완료');
//         },
//         error: (err) => {
//           alert('권한 에러');
//         },
//         complete: () => {},
//       });
//     }
//   }

//   // 팝업닫기
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }

// // 편집 기능
// @Component({
//   selector: 'app-resmember',
//   templateUrl: './resmember.component.html',
//   styleUrls: ['./member.component.css'],
// })
// export class ResmemberComponent implements OnInit {
//   constructor(
//     public dialogRef: MatDialogRef<ResmemberComponent>,
//     private service: ApiService,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData
//   ) {}
//   hide = true;

//   token = this.data.token;
//   getalldata = this.data.getalldata;

//   cnt = this.data.cnt;

//   form: FormGroup;

//   ngOnInit(): void {
//     this.form = new FormGroup({
//       username: new FormControl(''),
//       name: new FormControl(''),
//       customerName: new FormControl(''),
//       phone: new FormControl(''),
//       email: new FormControl(''),
//       passwordGroup: new FormGroup(
//         {
//           password: new FormControl('', [Validators.required]),
//           passwordconfirm: new FormControl('', [Validators.required]),
//         },
//         this.equalPassword
//       ),
//     });
//     this.getOneDevice();
//   }

//   //비밀번호 유효성검사
//   equalPassword({ value }: FormGroup): { [key: string]: any } {
//     const [first, ...rest] = Object.keys(value || {});
//     if (first.length == 0 && rest.length == 0) {
//       return;
//     } else {
//       const valid = rest.every((v) => value[v] === value[first]);
//       return valid ? null : { equal: true };
//     }
//   }

//   getOneDevice() {
//     this.form.patchValue({
//       deviceId: this.getalldata['deviceId'],
//       devicecustomerNameId: this.getalldata['customerName'],
//       name: this.getalldata['name'],
//       model: this.getalldata['model'],
//       customerName: this.getalldata['customerName'],
//       location: this.getalldata['location'],
//       installDate: this.getalldata['installDate'],
//       communicateMethod: this.getalldata['communicateMethod'],
//       userMemo: this.getalldata['userMemo'],
//     });
//   }

//   formSubmit() {
//     const temp = this.form.value;
//     const data = [this.getalldata['deviceId'], temp];
//     console.log('temp : ', temp);
//     console.log('data : ', data);
//     if (this.form.valid) {
//       this.service.modifyonedevice(data).subscribe({
//         next: (res) => {
//           alert('기기 정보 수정이 완료되었습니다');
//         },
//         error: (err) => {
//           alert('정보를 잘못 입력하셨습니다');
//         },
//         complete: () => {},
//       });
//     }
//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }
