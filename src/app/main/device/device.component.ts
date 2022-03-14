import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  deviceenrollForm: FormGroup;
  public modal: boolean = false;
  fileSelected?: Blob;
  // imageUrl?: string;
  imageSrc: any;

  constructor(public router: Router, private service: ApiService) { }

  getalldevicesdata = [];
  getalldevices() {
    this.service.getalldevices(localStorage.getItem('customer_code')).subscribe({
      next: (res) => {
        this.getalldevicesdata = res;
        console.log(this.getalldevicesdata, 'dkdkdk')
      },
      error: (err) => {

      },
      complete: () => {
      }
    });
  }


  ngOnInit(): void {
    this.deviceenrollForm = new FormGroup({
      'customerCode': new FormControl("", [Validators.required]),
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

  onFileChange(files: FileList): void {
    this.fileSelected = files[0]
    // this.imageUrl = this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileSelected)) as string;

    const reader = new FileReader();
    reader.readAsDataURL(this.fileSelected);
    reader.onload = () => {
      this.imageSrc = reader.result;
      console.log()
    }
  }


  clickedModalClose() {
    this.modal = false;
    this.deviceenrollForm.reset()
  }
  clickedModal() {
    this.modal = true;
  }
  deviceenroll() {
    this.modal = false;
    const data = this.deviceenrollForm.value;
    if (this.deviceenrollForm.valid) {
      this.service.deviceenroll(data).subscribe({
        next: (res) => {
          alert('디바이스 등록이 완료되었습니다')
          this.deviceenrollForm.reset()
        },
        error: (err) => {
          console.log(err, '에러코드')
          alert('정보를 잘못 입력하셨습니다')
        },
        complete: () => {
        }
      });
    }
  }

}
