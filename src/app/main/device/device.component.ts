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
  public modal: boolean = false;
  public modal2: boolean = false;
  token = "";
  customer_code = "";

  fileSelected?: Blob;
  imageSrc: string;

  constructor(public router: Router, private service: ApiService, private sant: DomSanitizer) { }

  getalldevicesdata = [];
  getonedevicedata = [];
  getalldevices() {
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
    this.token = sessionStorage.getItem('token')
    this.customer_code = sessionStorage.getItem('customer_code')
    this.deviceenrollForm = new FormGroup({
      'name': new FormControl("", [Validators.required]),
      'model': new FormControl("", [Validators.required]),
      'location': new FormControl("",),
      'installDate': new FormControl("",),
      'picture': new FormControl("",),
      'communicateMethod': new FormControl("",),
      'userMemo': new FormControl("",),
    });
    this.getalldevices();

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

    this.deviceenrollForm.patchValue({
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
    const temp = this.deviceenrollForm.value;
    const data = [this.getonedeviceId, temp];

    if (this.deviceenrollForm.valid) {
      this.service.modifyonedevice(data).subscribe({
        next: (res) => {
          alert('디바이스 수정이 완료되었습니다')
          this.getalldevices()
          this.deviceenrollForm.reset()
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
    const returnValue = confirm('디바이스를 삭제 하시겠습니까?')

    if (returnValue) {
      const deviceid = this.getalldevicesdata[index]["deviceId"]
      this.service.deleteonedevice(deviceid).subscribe({
        next: (res) => {
          alert('디바이스 삭제가 완료되었습니다')
          this.getalldevices()
        },
        error: (err) => {
          alert('디바이스 삭제 실패')
          console.log('에러', err)
        },
        complete: () => {
        }
      });
    }
  }




}
