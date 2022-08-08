import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-emailtab',
  templateUrl: './emailtab.component.html',
  styleUrls: ['../settingmodal.component.css'],
})
export class EmailtabComponent implements OnInit {
  registeremailForm: FormGroup;

  // websocket 템프 데이터
  requestreceived = [];
  // websocket 알림 데이터

  getalarmemaildata = [];

  constructor(public router: Router, private service: ApiService) {}

  ngOnInit() {
    this.registeremailForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });
    this.getalarmemailuser();
    this.getallemail();
  }

  getalarmemailuser() {
    // this.getalarmemaildata = [];
    this.service.getalarmemailuser().subscribe({
      next: (res) => {
        this.getalarmemaildata = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  registeremailuser() {
    this.service.registeremailalarm(this.registeremailForm.value).subscribe({
      next: (res) => {
        this.getalarmemailuser();
        this.registeremailForm.reset();
      },
      error: (err) => {
        alert('서버 에러');
      },
      complete: () => {},
    });
  }

  deleteemailalarm(index) {
    const data = this.getalarmemaildata[index];

    this.service.deleteemailalarm(data.email).subscribe({
      next: (res) => {
        alert('삭제 완료 되었습니다.');
        this.getalarmemailuser();
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  oneemailsetting(index) {
    const data = this.getalarmemaildata[index];
    data.setting = !data.setting;
    delete data.email;
    delete data.customerName;

    this.service.oneemailsetting(data).subscribe({
      next: (res) => {
        this.getalarmemailuser();
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  allemaildata: Boolean;
  getallemail() {
    this.service.getallalarmemail().subscribe({
      next: (res) => {
        this.allemaildata = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  allemailsetting() {
    this.allemaildata = !this.allemaildata;
    this.service.allalarmemailsetting(this.allemaildata).subscribe({
      next: (res) => {},
      error: (err) => {
        alert('내부 서버에러');
      },
      complete: () => {},
    });
  }
}
