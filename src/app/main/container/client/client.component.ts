import { Component, OnInit, Inject, Input } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  customers: string;
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['../container.table.css', './client.component.css'],
})
export class ClientComponent implements OnInit {
  @Input() userLog = [];
  token = sessionStorage.getItem('token');

  displayedColumns = [
    'customerName',
    'staffName',
    'phone',
    'numDevice',
    'status',
    'payMethod',
    'alarm',
    'change',
  ];

  constructor(private service: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataList();
  }

  // 사용자데이터
  dataSource = [];
  dataList() {
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          const temp = [this.token, res.customerCode];
          this.service.getallcustomers(temp).subscribe({
            next: (res) => {
              this.dataSource = res;
            },
            error: (err) => {},
            complete: () => {},
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

  //등록
  clickedaddModal() {
    const dialogRef = this.dialog.open(AddclientComponent, {
      width: '600px',
      height: '1100px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.dataList();
    });
  }

  // 수정
  clickedregModal(customers) {
    const dialogRef = this.dialog.open(ResclientComponent, {
      width: '600px',
      height: '1100px',
      data: {
        customers: customers,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.dataList();
    });
  }

  // 삭제
  deletedata(customers) {
    const returnValue = confirm(
      customers['customerName'] + ' 고객사를 삭제 하시겠습니까?'
    );
    if (returnValue) {
      this.service.deleteonecustomer(customers['customerCode']).subscribe({
        next: (res) => {
          this.dataList();
        },
        error: (err) => {
          alert('서버 에러');
        },
      });
    }
  }
}

// 등록기능
@Component({
  selector: 'app-addclient',
  templateUrl: 'addclient.component.html',
  styleUrls: ['../../popup.css', './client.component.css'],
})
export class AddclientComponent implements OnInit {
  fileSelected?: Blob;
  imageSrc: string;
  mapSrc: string;
  Form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddclientComponent>,
    private service: ApiService
  ) {}

  ngOnInit(): void {
    this.Form = new FormGroup({
      customerName: new FormControl('', [Validators.required]),
      staffName: new FormControl(''),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(10),
        Validators.maxLength(11),
      ]),
      status: new FormControl(''),
      payMethod: new FormControl(''),
      logo: new FormControl(''),
      map: new FormControl(''),
    });
  }

  // 등록
  submit() {
    const data = this.Form.value;
    if (data['logo'].length < 1) {
      data['logo'] = 'http://api-2207.bs-soft.co.kr/api/images/person-fill.svg';
    }
    if (data['map'].length < 1) {
      data['map'] = 'http://api-2207.bs-soft.co.kr/api/images/map.png';
    }
    if (this.Form.valid) {
      this.service.registeronecustomer(data).subscribe({
        next: (res) => {
          alert('고객사 등록이 완료되었습니다');
          this.Form.reset();
        },
        error: (err) => {
          alert('정보를 잘못 입력하셨습니다');
        },
        complete() {
          this.onNoClick();
        },
      });
    }
  }

  // 이미지 업로드
  onFileChange(event, index) {
    this.fileSelected = event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileSelected);

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        if (index === 1) {
          this.imageSrc = res.url;
          this.Form.patchValue({
            logo: this.imageSrc,
          });
        } else {
          this.mapSrc = res.url;
          this.Form.patchValue({
            map: this.mapSrc,
          });
        }
      },
      error: (err) => {
        alert('서버 에러메세지');
      },
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-resclient',
  templateUrl: 'resclient.component.html',
  styleUrls: ['../../popup.css', './client.component.css'],
})
export class ResclientComponent implements OnInit {
  fileSelected?: Blob;
  imageSrc: string;
  mapSrc: string;
  Form: FormGroup;

  customers = this.data.customers;

  constructor(
    public dialogRef: MatDialogRef<AddclientComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.Form = new FormGroup({
      customerName: new FormControl('', [Validators.required]),
      staffName: new FormControl(''),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(10),
        Validators.maxLength(11),
      ]),
      status: new FormControl(''),
      payMethod: new FormControl(''),
      logo: new FormControl(''),
      map: new FormControl(''),
    });
    this.getOneUser();
  }

  // 정보 불러옴
  getOneUser() {
    // this.imageSrc = this.customers['logo'];
    // this.mapSrc = this.customers['map'];
    this.Form.patchValue({
      customerName: this.customers['customerName'],
      staffName: this.customers['staffName'],
      phone: this.customers['phone'],
      status: this.customers['status'],
      payMethod: this.customers['payMethod'],
      logo: this.customers['logo'],
      map: this.customers['map'],
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
          this.Form.patchValue({
            logo: this.imageSrc,
          });
        } else {
          this.mapSrc = res.url;
          this.Form.patchValue({
            map: this.mapSrc,
          });
        }
      },
      error: (err) => {
        alert('서버 에러메세지');
      },
    });
  }

  // 수정
  submit() {
    const temp = [this.customers['customerCode'], this.Form.value];
    if (this.Form.valid) {
      this.service.modifyonecustomer(temp).subscribe({
        next: (res) => {
          alert('고객사 수정이 완료되었습니다');
          this.Form.reset();
        },
        error: (err) => {
          alert('정보를 잘못 입력하셨습니다');
        },
        complete() {
          this.onNoClick();
        },
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
