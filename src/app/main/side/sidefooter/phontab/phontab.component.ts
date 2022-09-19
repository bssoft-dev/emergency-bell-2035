import { Component, OnInit, DoCheck } from '@angular/core';
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
export class PhontabComponent implements OnInit, DoCheck {
  Form: FormGroup;

  displayedColumns: string[] = ['name', 'phone', 'setting', 'delete'];
  dataSource = [];

  constructor(public router: Router, private service: ApiService) {
    this.getUser();
    this.getallsms();
  }

  ngOnInit() {
    this.Form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    });
  }

  // 테이블데이터
  getUser() {
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
        this.getUser();
        this.Form.reset();
      },
      error: (err) => {
        alert('서버 에러');
      },
      complete: () => {},
    });
  }

  // 삭제
  deletedata(element) {
    const returnValue = confirm(
      element.name + '기기 정보를 삭제 하시겠습니까?'
    );

    if (returnValue) {
      this.service.deletesmsalarm(element.phone).subscribe({
        next: (res) => {
          alert('삭제 완료 되었습니다.');
          this.getUser();
        },
        error: (err) => {},
        complete: () => {},
      });
    }
  }

  // 개인설정
  onSetting(element) {
    const userSetting = !element.setting;
    const data = {
      name: element.name,
      setting: element.setting,
    };
    this.service.onesmssetting(data).subscribe({
      next: (res) => {},
      error: (err) => {},
      complete: () => {},
    });
  }

  allData: boolean;
  allData2: boolean;
  // 전체 sms 설정값 가져오기
  getallsms() {
    this.service.getallalarmsms().subscribe({
      next: (res) => {
        this.allData = res;
        this.allData2 = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  // 전체 sms 설정값 변경
  ngDoCheck(): void {
    if (this.allData2 != this.allData) {
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
}
