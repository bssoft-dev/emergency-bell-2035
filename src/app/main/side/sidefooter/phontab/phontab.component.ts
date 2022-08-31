import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-phontab',
  templateUrl: './phontab.component.html',
  styleUrls: [
    '../../../popup.css',
    '../settingmodal.component.css',
    '../../../container/container.table.css',
  ],
})
export class PhontabComponent implements OnInit {
  Form: FormGroup;

  displayedColumns: string[] = ['name', 'phone', 'setting', 'delete'];
  dataSource = [];

  constructor(public router: Router, private service: ApiService) {}

  ngOnInit() {
    this.Form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    });
    this.getalarmsmsuser();
    this.getallsms();
  }

  getalarmsmsuser() {
    // this.dataSource = [];
    this.service.getalarmsmsuser().subscribe({
      next: (res) => {
        this.dataSource = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  submit() {
    this.service.registersmsalarm(this.Form.value).subscribe({
      next: (res) => {
        this.getalarmsmsuser();
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

    this.service.deletesmsalarm(data.phone).subscribe({
      next: (res) => {
        alert('삭제 완료 되었습니다.');
        this.getalarmsmsuser();
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  onSetting(index) {
    const data = index;
    data.setting = !data.setting;
    delete data.phone;
    delete data.customerName;

    this.service.oneesmssetting(data).subscribe({
      next: (res) => {
        this.getalarmsmsuser();
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  allData = false;
  getallsms() {
    this.service.getallalarmsms().subscribe({
      next: (res) => {
        this.allData = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  allSetting() {
    this.allData = !this.allData;
    this.service.allalarmsmssetting(this.allData).subscribe({
      next: (res) => {},
      error: (err) => {
        alert('내부 서버에러');
      },
      complete: () => {},
    });
  }
}
