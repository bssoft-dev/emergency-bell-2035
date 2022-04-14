import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {


  deviceenrollForm: FormGroup;
  devicemodifyForm: FormGroup;
  public modal: boolean = false;
  public modal2: boolean = false;
  token = "";
  customer_code = "";

  fileSelected?: Blob;
  imageSrc: string;

  constructor(public router: Router, private service: ApiService, private sant: DomSanitizer) { }

  currentusercheckdata = [];
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
        complete: () => {
        }
      })
    })
  }

  initgetalldevices(res) {
    this.getalldevicesdata = [];
    const temp = [sessionStorage.getItem('token'), res.customerCode]

    this.service.getalldevices(temp).subscribe({
      next: (res) => {
        this.getalldevicesdata = res;
        console.log(this.getalldevicesdata, '얼데이타')
      },
      error: (err) => {

      },
      complete: () => {
      }
    });
  }


  getalldevicesdata = [];
  getonedevicedata = [];
  getalldevices() {
    this.getalldevicesdata = [];
    const temp = [this.token, this.customer_code]

    this.service.getalldevices(temp).subscribe({
      next: (res) => {
        this.getalldevicesdata = res;
        console.log(this.getalldevicesdata, '얼데이타')
      },
      error: (err) => {

      },
      complete: () => {
      }
    });
  }


  ngOnInit(): void {
    this.currentusercheck().then((res) => {
      this.initgetalldevices(res)
    })
    this.deviceenrollForm = new FormGroup({
      'deviceId': new FormControl(null, [Validators.required]),
      'name': new FormControl("", [Validators.required]),
      'model': new FormControl("", [Validators.required]),
      'location': new FormControl("",),
      'installDate': new FormControl("",),
      'picture': new FormControl("",),
      'communicateMethod': new FormControl("",),
      'userMemo': new FormControl("",),
    });
    this.devicemodifyForm = new FormGroup({
      'name': new FormControl("", [Validators.required]),
      'model': new FormControl("", [Validators.required]),
      'location': new FormControl("",),
      'installDate': new FormControl("",),
      'picture': new FormControl("",),
      'communicateMethod': new FormControl("",),
      'userMemo': new FormControl("",),
    });

  }

  ngOnDestroy() {
    this.getalldevicesdata = [];
    this.getonedevicedata = [];
  }

  onFileChange(event): void {
    this.fileSelected = event.target.files[0]
    const formData = new FormData();
    formData.append(
      "file",
      this.fileSelected
    );

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        this.imageSrc = res.url;
        this.deviceenrollForm.patchValue({
          picture: this.imageSrc
        })
        this.devicemodifyForm.patchValue({
          picture: this.imageSrc
        })
      },
      error: (err) => {
        alert('서버 에러메세지')
      },
      complete: () => {
      }
    });
  }

  clickedModalClose() {
    this.modal = false;
    this.deviceenrollForm.reset()
    this.imageSrc = "";
  }
  clickedModal() {
    this.modal = true;
  }
  clickedModal2Close() {
    this.deviceenrollForm.reset()
    this.modal2 = false;
    this.imageSrc = "";
  }
  clickedModal2() {
    this.modal2 = true;
  }

  deviceenroll() {
    if (this.customer_code === "bssoft") {
    }
    const data = this.deviceenrollForm.value;
    console.log(data, 'dkdkdk')
    if (this.deviceenrollForm.valid) {
      this.service.deviceenroll(data).subscribe({
        next: (res) => {
          alert('디바이스 등록이 완료되었습니다')
          this.deviceenrollForm.reset()
          this.getalldevices();
          this.modal = false;
        },
        error: (err) => {
          console.log(err, '에러코드')
          alert('정보를 잘못 입력하셨습니다')
        },
        complete: () => {
        }
      });
    } else {
      alert('정보를 입력해주세요')
    }

  }

  getonedeviceId;
  getOneDevice(index) {
    this.modal2 = true;
    this.getonedevicedata = this.getalldevicesdata[index]
    this.getonedeviceId = this.getonedevicedata['deviceId']
    this.imageSrc = this.getonedevicedata["picture"]

    this.devicemodifyForm.patchValue({
      name: this.getonedevicedata["name"],
      model: this.getonedevicedata["model"],
      picture: this.getonedevicedata['picture'],
      location: this.getonedevicedata["location"],
      installDate: this.getonedevicedata["installDate"],
      communicateMethod: this.getonedevicedata["communicateMethod"],
      userMemo: this.getonedevicedata["userMemo"],
    })

  }

  modifyonedevice() {
    const temp = this.devicemodifyForm.value;
    const data = [this.getonedeviceId, temp];
    console.log(data, '데이터')
    if (this.devicemodifyForm.valid) {
      this.service.modifyonedevice(data).subscribe({
        next: (res) => {
          alert('기기 정보 수정이 완료되었습니다')
          this.getalldevices()
          this.devicemodifyForm.reset()
          this.modal2 = false;
        },
        error: (err) => {
          console.log(err, '에러코드')
          alert('정보를 잘못 입력하셨습니다')
        },
        complete: () => {
        }
      });
    } else {
      alert('정보를 입력해주세요')
    }
  }

  deleteonedevice(index) {
    const returnValue = confirm('기기 정보를 삭제 하시겠습니까?')

    if (returnValue) {
      const deviceid = this.getalldevicesdata[index]["deviceId"]
      this.service.deleteonedevice(deviceid).subscribe({
        next: (res) => {
          alert('기기 정보 삭제가 완료되었습니다')
          this.getalldevices()
        },
        error: (err) => {
          alert('기기 정보 삭제 실패')
          console.log('에러', err)
        },
        complete: () => {
        }
      });
    }
  }

  chkinspection(index) {
    const data = [this.getalldevicesdata[index].deviceId, { "inspection": !this.getalldevicesdata[index].inspection }];
    console.log(data)

    this.service.modifyinspection(data).subscribe({
      next: (res) => {
        this.getalldevices();
      },
      error: (err) => {

      },
      complete: () => {
      }
    });
  }




}
