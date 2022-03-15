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
  imageUrl?: string;
  imageSrc: any;

  constructor(public router: Router, private service: ApiService, private sant: DomSanitizer) { }

  getalldevicesdata = [];
  getonedevicedata = [];
  picturesource = "";

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
    // this.imageUrl = this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileSelected)) as string;

    const reader = new FileReader();
    reader.readAsDataURL(this.fileSelected);
    reader.onload = () => {
      this.imageSrc = reader.result;
      console.log(this.imageSrc, 'dkdkdk')
    }
  }
  onChange(evt) {
    console.log(evt.target.files)
  }


  clickedModalClose() {
    this.modal = false;
    this.deviceenrollForm.reset()
  }
  clickedModal() {
    this.modal = true;
  }

  clickedModal2Close() {
    this.deviceenrollForm.reset()
    this.modal2 = false;
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
    this.picturesource = this.getonedevicedata["picture"]

    this.deviceenrollForm.patchValue({
      deviceId: this.getonedevicedata["deviceId"],
      name: this.getonedevicedata["name"],
      model: this.getonedevicedata["model"],
      location: this.getonedevicedata["location"],
      installDate: this.getonedevicedata["installDate"],
      communicateMethod: this.getonedevicedata["communicateMethod"],
      userMemo: this.getonedevicedata["userMemo"],
    })
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
