import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emailtab',
  templateUrl: './emailtab.component.html',
  styleUrls: [
    '../../../popup.css',
    '../settingmodal.component.css',
    '../../../container/container.table.css',
  ],
})
export class EmailtabComponent implements OnInit {
  Form: FormGroup;

  displayedColumns: string[] = ['name', 'email', 'setting', 'delete'];
  dataSource = [];

  constructor(public router: Router, private service: ApiService) {}

  ngOnInit() {
    this.Form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });
    this.getalarmemailuser();
    this.getallemail();
  }

  getalarmemailuser() {
    // this.dataSource = [];
    this.service.getalarmemailuser().subscribe({
      next: (res) => {
        this.dataSource = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  submit() {
    this.service.registeremailalarm(this.Form.value).subscribe({
      next: (res) => {
        this.getalarmemailuser();
        this.Form.reset();
      },
      error: (err) => {
        alert('서버 에러');
      },
      complete: () => {},
    });
  }

  deletedata(index) {
    const data = index;

    this.service.deleteemailalarm(data.email).subscribe({
      next: (res) => {
        alert('삭제 완료 되었습니다.');
        this.getalarmemailuser();
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  onSetting(index) {
    const data = index;
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

  allData = false;
  getallemail() {
    this.service.getallalarmemail().subscribe({
      next: (res) => {
        this.allData = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  allSetting() {
    this.allData = !this.allData;
    this.service.allalarmemailsetting(this.allData).subscribe({
      next: (res) => {},
      error: (err) => {
        alert('내부 서버에러');
      },
      complete: () => {},
    });
  }
}
