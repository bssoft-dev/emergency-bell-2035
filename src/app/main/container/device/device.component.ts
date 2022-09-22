import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  devicedata: string;
}

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['../container.table.css', './device.component.css'],
})
export class DeviceComponent implements OnInit {
  @Input() userLog = [];
  token = sessionStorage.getItem('token');
  customer_code = '';

  displayedColumns = [
    'picture',
    'model',
    'name',
    'location',
    'installDate',
    'communicateMethod',
    'inspection',
    'memo',
    'change',
  ];

  constructor(private service: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataList();
  }

  // 사용자데이터
  dataSource = [];
  dataList() {
    return new Promise(() => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          const temp = [this.token, res.customerCode];
          this.service.getalldevices(temp).subscribe({
            next: (res) => {
              this.dataSource = res;
            },
          });
        },
      });
    });
  }

  //등록 팝업
  clickedaddModal() {
    const dialogRef = this.dialog.open(AdddeviceComponent, {
      width: '600px',
      height: '1200px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(() => {
      this.dataList();
    });
  }

  // 사진확대 팝업
  pictureopen(devicedata) {
    const dialogRef = this.dialog.open(devicepotoComponent, {
      width: '500px',
      height: '500px',
      data: {
        devicedata: devicedata,
      },
    });
  }

  // 수정 팝업
  clickedregModal(devicedata) {
    const dialogRef = this.dialog.open(RegdeviceComponent, {
      width: '600px',
      height: '1200px',
      data: {
        devicedata: devicedata,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.dataList();
    });
  }

  // 삭제
  deletedata(devicedata) {
    const returnValue = confirm(
      devicedata['customerName'] + '기기 정보를 삭제 하시겠습니까?'
    );

    if (returnValue) {
      this.service.deleteonedevice(devicedata['deviceId']).subscribe({
        next: (res) => {
          alert('기기 정보 삭제가 완료되었습니다');
          this.dataList();
        },
        error: (err) => {
          alert('기기 정보 삭제 실패');
        },
      });
    }
  }

  // 점검여부
  chkinspection(devicedata) {
    const data = [devicedata.deviceId, { inspection: devicedata.inspection }];
    this.service.modifyinspection(data).subscribe({
      next: (res) => {
        this.dataList();
      },
    });
  }
}

// 등록 기능
@Component({
  selector: 'app-adddevice',
  templateUrl: './adddevice.component.html',
  styleUrls: ['../../popup.css', './device.component.css'],
})
export class AdddeviceComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AdddeviceComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  Form: FormGroup;

  fileSelected?: Blob;
  imageSrc: string;
  bigpicturesrc: string;

  ngOnInit(): void {
    this.getdata();
    this.Form = new FormGroup({
      deviceId: new FormControl(null, [Validators.required]),
      // deviceId: new FormControl(''), // test code
      name: new FormControl(''),
      customerName: new FormControl(null, [Validators.required]),
      model: new FormControl(''),
      location: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      installDate: new FormControl('', [Validators.required]),
      picture: new FormControl(''),
      communicateMethod: new FormControl(''),
      userMemo: new FormControl(''),
    });
    // this.getOneDevice(); // test code
  }

  // getOneDevice() {
  //   this.Form.patchValue({
  //     deviceId: 'test',
  //   });
  // } // test code

  // 기기아이디
  unregidevices = [];
  // 고객사명
  customerNames = [];
  getdata() {
    this.service.getunregidevices().subscribe({
      next: (res) => {
        this.unregidevices = res;
      },
    });
    this.service.getCustomerNames(sessionStorage.getItem('token')).subscribe({
      next: (res) => {
        this.customerNames = res;
      },
    });
  }

  // 사진등록
  onFileChange(event): void {
    this.fileSelected = event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileSelected);

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        this.imageSrc = res.url;
        this.Form.patchValue({
          picture: this.imageSrc,
        });
      },
      error: (err) => {
        alert('서버 에러메세지');
      },
    });
  }

  submit() {
    const data = this.Form.value;
    if (data.customerName === null) {
      delete data.customerName;
      data.customerName = '';
    }
    if (data.deviceId === null) {
      delete data.deviceId;
      data.deviceId = '';
    }
    if (data.picture === '') {
      data.picture = 'http://api-2207.bs-soft.co.kr/api/images/noimage.png';
    }
    if (data.picture === null) {
      data.picture = 'http://api-2207.bs-soft.co.kr/api/images/noimage.png';
    }

    if (this.Form.valid) {
      this.service.deviceenroll(data).subscribe({
        next: (res) => {
          alert('디바이스 등록이 완료되었습니다');
        },
        error: (err) => {
          alert('권한이 없습니다');
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

// 수정 기능
@Component({
  selector: 'app-regdevice',
  templateUrl: './regdevice.component.html',
  styleUrls: ['../../popup.css', './device.component.css'],
})
export class RegdeviceComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RegdeviceComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  devicedata = this.data.devicedata;
  imageSrc = this.devicedata['picture'];
  Form: FormGroup;
  fileSelected?: Blob;
  bigpicturesrc: string;

  // 사진
  onFileChange(event): void {
    this.fileSelected = event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileSelected);

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        this.imageSrc = res.url;
        this.Form.patchValue({
          picture: this.imageSrc,
        });
      },
      error: (err) => {
        alert('서버 에러메세지');
      },
      complete: () => {},
    });
  }

  ngOnInit(): void {
    this.Form = new FormGroup({
      deviceId: new FormControl(''),
      devicecustomerNameId: new FormControl(''),
      name: new FormControl(''),
      customerName: new FormControl(null, [Validators.required]),
      model: new FormControl(''),
      location: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      installDate: new FormControl(''),
      picture: new FormControl(''),
      communicateMethod: new FormControl(''),
      userMemo: new FormControl(''),
    });
    this.getOneDevice();
  }

  // 사용자 정보
  getOneDevice() {
    this.Form.patchValue({
      deviceId: this.devicedata['deviceId'],
      devicecustomerNameId: this.devicedata['customerName'],
      name: this.devicedata['name'],
      model: this.devicedata['model'],
      customerName: this.devicedata['customerName'],
      location: this.devicedata['location'],
      installDate: this.devicedata['installDate'],
      communicateMethod: this.devicedata['communicateMethod'],
      userMemo: this.devicedata['userMemo'],
      picture: this.devicedata['picture'],
    });
  }

  submit() {
    const temp = this.Form.value;
    const data = [this.devicedata['deviceId'], temp];
    if (this.Form.valid) {
      this.service.modifyonedevice(data).subscribe({
        next: (res) => {
          alert('기기 정보 수정이 완료되었습니다');
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

// 사진확대
@Component({
  selector: 'app-devicepoto',
  templateUrl: './devicepoto.component.html',
  styleUrls: ['./device.component.css'],
})
export class devicepotoComponent implements OnInit {
  imageSrc = this.data.devicedata['picture'];

  constructor(
    public dialogRef: MatDialogRef<RegdeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  ngOnInit(): void {}
}
