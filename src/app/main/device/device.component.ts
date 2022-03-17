import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
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

  fileSelected?: Blob;
  imageSrc: string;

  constructor(public router: Router, private service: ApiService, private sant: DomSanitizer) { }

  getalldevicesdata = [];
  getonedevicedata = [];

  getalldevices() {
    this.service.getalldevices(localStorage.getItem('customer_code')).subscribe({
      next: (res) => {
        this.getalldevicesdata = res;
      },
      error: (err) => {

      },
      complete: () => {
      }
    });
  }


  ngOnInit(): void {
    this.deviceenrollForm = new FormGroup({
      'deviceId': new FormControl("", [Validators.required]),
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

  onFileChange(event): void {
    this.fileSelected = event.target.files[0]
    const formData = new FormData();
    formData.append(
      "file",
      this.fileSelected
    );

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        alert('사진 업로드 완료')
        this.imageSrc = res.url;
        console.log('김영승3', this.deviceenrollForm.value)
        this.deviceenrollForm.patchValue({
          picture: this.imageSrc
        })
        console.log('김영승4', this.deviceenrollForm.value)
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
    const data = this.deviceenrollForm.value;
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

  getOneDevice(index) {
    this.modal2 = true;
    this.getonedevicedata = this.getalldevicesdata[index]
    console.log(this.getonedevicedata, '가져오는데이터')
    this.imageSrc = this.getonedevicedata["picture"]
    console.log('김영승1', this.deviceenrollForm.value)

    this.deviceenrollForm.patchValue({
      deviceId: this.getonedevicedata["deviceId"],
      name: this.getonedevicedata["name"],
      model: this.getonedevicedata["model"],
      location: this.getonedevicedata["location"],
      installDate: this.getonedevicedata["installDate"],
      communicateMethod: this.getonedevicedata["communicateMethod"],
      userMemo: this.getonedevicedata["userMemo"],
    })

    console.log('김영승2', this.deviceenrollForm.value)

  }

  modifyonedevice() {

    const data = this.deviceenrollForm.value;
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


}
