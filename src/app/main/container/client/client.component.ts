import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  token: string;
  customer_code: string;
  getcustomersdata: [];
  cnt: number;
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css', '../container.component.css'],
})
export class ClientComponent implements OnInit {
  customer_code = '';
  token = sessionStorage.getItem('token');

  constructor(private service: ApiService, public dialog: MatDialog) {}

  // 사용자 체크
  currentusercheckdata = [];
  currentusercheck() {
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          this.customer_code = res.customerCode;
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }

  // 데이터 불러오기
  getcustomersdata = [];
  initgetcustomers() {
    const temp = [this.token, this.customer_code];
    this.getcustomersdata = [];
    this.service.getallcustomers(temp).subscribe({
      next: (res) => {
        this.getcustomersdata = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  //등록 팝업
  clickedaddModal() {
    const dialogRef = this.dialog.open(AddclientComponent, {
      width: '750px',
      height: '1100px',
      data: {
        token: this.token,
        customer_code: this.customer_code,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.currentusercheck().then((res) => {
        this.initgetcustomers();
      });
    });
  }

  ngOnInit() {
    this.currentusercheck().then((res) => {
      this.initgetcustomers();
    });
  }

  // 수정 팝업
  clickedregModal(index) {
    const dialogRef = this.dialog.open(ResclientComponent, {
      width: '750px',
      height: '1100px',
      data: {
        token: this.token,
        customer_code: this.customer_code,
        getcustomersdata: this.getcustomersdata,
        cnt: index,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.initgetcustomers();
    });
  }

  // 삭제
  deleteonecustomer(index) {
    const returnValue = confirm(
      this.getcustomersdata[index]['customerName'] +
        ' 고객사를 삭제 하시겠습니까?'
    );
    if (returnValue) {
      this.service
        .deleteonecustomer(this.getcustomersdata[index]['customerCode'])
        .subscribe({
          next: (res) => {
            this.initgetcustomers();
          },
          error: (err) => {
            alert('서버 에러');
          },
          complete: () => {},
        });
    }
  }
}

// 등록 기능
@Component({
  selector: 'app-addclient',
  templateUrl: 'addclient.component.html',
  styleUrls: ['./client.component.css', '../container.component.css'],
})
export class AddclientComponent implements OnInit {
  fileSelected?: Blob;
  imageSrc: string;
  mapSrc: string;
  token = this.data.token;
  customer_code = this.data.customer_code;

  registerclientForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddclientComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.registerclientForm = new FormGroup({
      customerName: new FormControl('', [Validators.required]),
      staffName: new FormControl(''),
      phone: new FormControl('', [Validators.required]),
      status: new FormControl(''),
      payMethod: new FormControl(''),
      logo: new FormControl(''),
      map: new FormControl(''),
    });
  }

  registeronecustomer() {
    const data = this.registerclientForm.value;
    if (data['logo'].length < 1) {
      data['logo'] = 'http://api-2207.bs-soft.co.kr/api/images/person-fill.svg';
    }
    if (data['map'].length < 1) {
      data['map'] = 'http://api-2207.bs-soft.co.kr/api/images/map.png';
    }
    if (this.registerclientForm.valid) {
      this.service.registeronecustomer(data).subscribe({
        next: (res) => {
          alert('고객사 등록이 완료되었습니다');
          this.registerclientForm.reset();
        },
        error: (err) => {
          alert('정보를 잘못 입력하셨습니다');
        },
        complete: () => {},
      });
    }
  }

  // 이미지 업로드
  onFileChange(event, index): void {
    this.fileSelected = event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileSelected);

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        if (index === 1) {
          this.imageSrc = res.url;
          this.registerclientForm.patchValue({
            logo: this.imageSrc,
          });
        } else {
          this.mapSrc = res.url;
          this.registerclientForm.patchValue({
            map: this.mapSrc,
          });
        }
      },
      error: (err) => {
        alert('서버 에러메세지');
      },
      complete: () => {},
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-resclient',
  templateUrl: 'resclient.component.html',
  styleUrls: ['./client.component.css', '../container.component.css'],
})
export class ResclientComponent implements OnInit {
  fileSelected?: Blob;
  imageSrc: string;
  mapSrc: string;
  token = this.data.token;
  customer_code = this.data.customer_code;
  getcustomersdata = this.data.getcustomersdata;
  cnt = this.data.cnt;

  modifyclientForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddclientComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.modifyclientForm = new FormGroup({
      customerName: new FormControl('', [Validators.required]),
      staffName: new FormControl(''),
      phone: new FormControl('', [Validators.required]),
      status: new FormControl(''),
      payMethod: new FormControl(''),
      logo: new FormControl(''),
      map: new FormControl(''),
    });
    this.getOnecustomers();
  }

  // 정보 불러옴
  getonecustomerdata = [];
  getOnecustomers() {
    this.getonecustomerdata.push(this.getcustomersdata[this.cnt]);
    this.imageSrc = this.getonecustomerdata[0]['logo'];
    this.mapSrc = this.getonecustomerdata[0]['map'];
    this.modifyclientForm.patchValue({
      customerName: this.getonecustomerdata[0]['customerName'],
      staffName: this.getonecustomerdata[0]['staffName'],
      phone: this.getonecustomerdata[0]['phone'],
      status: this.getonecustomerdata[0]['status'],
      payMethod: this.getonecustomerdata[0]['payMethod'],
      logo: this.getonecustomerdata[0]['logo'],
      map: this.getonecustomerdata[0]['map'],
    });
  }

  // 이미지 업로드
  onFileChange(event, index): void {
    this.fileSelected = event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileSelected);

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        if (index === 1) {
          this.imageSrc = res.url;
          this.modifyclientForm.patchValue({
            logo: this.imageSrc,
          });
        } else {
          this.mapSrc = res.url;
          this.modifyclientForm.patchValue({
            map: this.mapSrc,
          });
        }
      },
      error: (err) => {
        alert('서버 에러메세지');
      },
      complete: () => {},
    });
  }

  modifyonecustomer() {
    const temp = [];
    temp.push(this.getonecustomerdata[0]['customerCode']);
    const data = this.modifyclientForm.value;
    temp.push(data);
    if (this.modifyclientForm.valid) {
      this.service.modifyonecustomer(temp).subscribe({
        next: (res) => {
          alert('고객사 수정이 완료되었습니다');
          this.modifyclientForm.reset();
        },
        error: (err) => {
          alert('정보를 잘못 입력하셨습니다');
        },
        complete: () => {},
      });
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
