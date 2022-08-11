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
  customer_code: string;
  customerNames: [];
  unregidevices: [];
  getonedevicedata: [];
  cnt: number;
  imgsrc: string;
}

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css', '../container.component.css'],
})
export class DeviceComponent implements OnInit {
  token = sessionStorage.getItem('token');
  customer_code = '';

  constructor(private service: ApiService, public dialog: MatDialog) {}

  // 사용자 체크
  currentusercheck() {
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          resolve(res);
          this.customer_code = res.customerCode;
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }

  // 데이터 불러오기
  getalldevicesdata = [];
  initgetalldevices() {
    const temp = [this.token, this.customer_code];
    this.service.getalldevices(temp).subscribe({
      next: (res) => {
        this.getalldevicesdata = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  // 기기아이디
  unregidevices = [];
  initgetunregidevices() {
    this.service.getunregidevices().subscribe({
      next: (res) => {
        this.unregidevices = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  // 고객사명
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

  ngOnInit(): void {
    this.currentusercheck().then((res) => {
      this.initgetalldevices();
      this.initGetCustomerNames();
      this.initgetunregidevices();
    });
  }

  //등록 팝업
  clickedaddModal() {
    const dialogRef = this.dialog.open(AdddeviceComponent, {
      width: '750px',
      height: '1300px',
      data: {
        token: this.token,
        customer_code: this.customer_code,
        unregidevices: this.unregidevices,
        customerNames: this.customerNames,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.initgetalldevices();
    });
  }

  // 사진확대 팝업
  pictureopen(index) {
    const dialogRef = this.dialog.open(devicepotoComponent, {
      width: '500px',
      height: '500px',
      data: {
        imgsrc: this.getalldevicesdata[index].picture,
      },
    });
  }

  // 수정 팝업
  clickedregModal(index) {
    const dialogRef = this.dialog.open(RegdeviceComponent, {
      width: '750px',
      height: '1300px',
      data: {
        token: this.token,
        customer_code: this.customer_code,
        getonedevicedata: this.getalldevicesdata[index],
        imgsrc: this.getalldevicesdata[index].picture,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.initgetalldevices();
    });
  }

  // 삭제
  deleteonedevice(index) {
    const returnValue = confirm('기기 정보를 삭제 하시겠습니까?');

    if (returnValue) {
      const deviceid = this.getalldevicesdata[index]['deviceId'];
      this.service.deleteonedevice(deviceid).subscribe({
        next: (res) => {
          alert('기기 정보 삭제가 완료되었습니다');
          this.initgetalldevices();
        },
        error: (err) => {
          alert('기기 정보 삭제 실패');
        },
        complete: () => {},
      });
    }
  }

  // 점검여부
  chkinspection(index) {
    const data = [
      this.getalldevicesdata[index].deviceId,
      { inspection: this.getalldevicesdata[index].inspection },
    ];

    this.service.modifyinspection(data).subscribe({
      next: (res) => {
        this.initgetalldevices();
      },
      error: (err) => {},
      complete: () => {},
    });
  }
}

// 등록 기능
@Component({
  selector: 'app-adddevice',
  templateUrl: './adddevice.component.html',
  styleUrls: ['./device.component.css', '../container.component.css'],
})
export class AdddeviceComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AdddeviceComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  deviceenrollForm: FormGroup;
  token = this.data.token;
  customer_code = this.data.customer_code;
  unregidevices = this.data.unregidevices;
  customerNames = this.data.customerNames;

  fileSelected?: Blob;
  imageSrc: string;
  bigpicturesrc: string;

  ngOnInit(): void {
    this.deviceenrollForm = new FormGroup({
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
  //   this.deviceenrollForm.patchValue({
  //     deviceId: 'test',
  //   });
  // } // test code

  // 사진등록
  onFileChange(event): void {
    this.fileSelected = event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileSelected);

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        this.imageSrc = res.url;
        this.deviceenrollForm.patchValue({
          picture: this.imageSrc,
        });
      },
      error: (err) => {
        alert('서버 에러메세지');
      },
      complete: () => {},
    });
  }

  deviceenroll() {
    const data = this.deviceenrollForm.value;
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

    if (this.deviceenrollForm.valid) {
      console.log(data, 'llw');
      this.service.deviceenroll(data).subscribe({
        next: (res) => {
          alert('디바이스 등록이 완료되었습니다');
        },
        error: (err) => {
          alert('권한이 없습니다');
        },
        complete: () => {},
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// 편집 기능
@Component({
  selector: 'app-regdevice',
  templateUrl: './regdevice.component.html',
  styleUrls: ['./device.component.css', '../container.component.css'],
})
export class RegdeviceComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RegdeviceComponent>,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  token = this.data.token;
  customer_code = this.data.customer_code;
  cnt = this.data.cnt;
  getonedevicedata = this.data.getonedevicedata;
  imageSrc = this.data.imgsrc;

  devicemodifyForm: FormGroup;
  fileSelected?: Blob;
  bigpicturesrc: string;

  currentusercheck() {
    const token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(token).subscribe({
        next: (res) => {
          resolve(res);
          this.token = sessionStorage.getItem('token');
          this.customer_code = res.customerCode;
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {},
      });
    });
  }

  onFileChange(event): void {
    this.fileSelected = event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileSelected);

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        this.imageSrc = res.url;
        this.devicemodifyForm.patchValue({
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
    this.devicemodifyForm = new FormGroup({
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

  getOneDevice() {
    this.devicemodifyForm.patchValue({
      deviceId: this.getonedevicedata['deviceId'],
      devicecustomerNameId: this.getonedevicedata['customerName'],
      name: this.getonedevicedata['name'],
      model: this.getonedevicedata['model'],
      customerName: this.getonedevicedata['customerName'],
      location: this.getonedevicedata['location'],
      installDate: this.getonedevicedata['installDate'],
      communicateMethod: this.getonedevicedata['communicateMethod'],
      userMemo: this.getonedevicedata['userMemo'],
    });
  }

  modifyonedevice() {
    const temp = this.devicemodifyForm.value;
    const data = [this.getonedevicedata['deviceId'], temp];
    console.log('temp : ', temp);
    console.log('data : ', data);
    if (this.devicemodifyForm.valid) {
      this.service.modifyonedevice(data).subscribe({
        next: (res) => {
          alert('기기 정보 수정이 완료되었습니다');
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

@Component({
  selector: 'app-devicepoto',
  templateUrl: './devicepoto.component.html',
  styleUrls: ['./device.component.css', '../container.component.css'],
})
export class devicepotoComponent implements OnInit {
  imgsrc = this.data.imgsrc;
  constructor(
    public dialogRef: MatDialogRef<RegdeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  ngOnInit(): void {}
}
