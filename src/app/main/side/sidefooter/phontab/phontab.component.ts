import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-phontab',
  templateUrl: './phontab.component.html',
  styleUrls: ['../settingmodal.component.css'],
})
export class PhontabComponent implements OnInit {
  displayedColumns: string[] = ['name', 'phone', 'setting', 'del'];
  getalarmsmsdata = [];

  registersmsForm: FormGroup;

  // websocket 템프 데이터
  requestreceived = [];
  // websocket 알림 데이터

  constructor(public router: Router, private service: ApiService) {}

  ngOnInit() {
    this.registersmsForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    });
    this.getalarmsmsuser();
    this.getallsms();
  }

  getalarmsmsuser() {
    // this.getalarmsmsdata = [];
    this.service.getalarmsmsuser().subscribe({
      next: (res) => {
        this.getalarmsmsdata = res;
      },
      error: (err) => {},
      complete: () => {},
    });
    console.log(this.getalarmsmsdata);
  }

  registersmsuser() {
    this.service.registersmsalarm(this.registersmsForm.value).subscribe({
      next: (res) => {
        this.getalarmsmsuser();
        this.registersmsForm.reset();
      },
      error: (err) => {
        alert('서버 에러');
      },
      complete: () => {},
    });
  }

  deletesmsalarm(index) {
    const data = this.getalarmsmsdata[index];

    this.service.deletesmsalarm(data.phone).subscribe({
      next: (res) => {
        alert('삭제 완료 되었습니다.');
        this.getalarmsmsuser();
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  onesmssetting(index) {
    const data = this.getalarmsmsdata[index];
    data.setting = !data.setting;
    delete data.phone;
    delete data.customerName;

    this.service.onesmssetting(data).subscribe({
      next: (res) => {
        this.getalarmsmsuser();
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  allsmsdata = false;
  getallsms() {
    this.service.getallalarmsms().subscribe({
      next: (res) => {
        this.allsmsdata = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  allsmssetting() {
    this.allsmsdata = !this.allsmsdata;
    this.service.allalarmsmssetting(this.allsmsdata).subscribe({
      next: (res) => {},
      error: (err) => {
        alert('내부 서버에러');
      },
      complete: () => {},
    });
  }
}
