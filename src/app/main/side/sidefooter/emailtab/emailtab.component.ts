import { Component, OnInit, DoCheck } from '@angular/core';
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
export class EmailtabComponent implements OnInit, DoCheck {
  Form: FormGroup;

  displayedColumns: string[] = ['name', 'email', 'setting', 'delete'];
  dataSource = [];

  constructor(public router: Router, private service: ApiService) {
    this.getUser();
    this.getallemail();
  }

  ngOnInit() {
    this.Form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });
  }

  // 테이블데이터
  getUser() {
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
        this.getUser();
        this.Form.reset();
      },
      error: (err) => {
        alert('올바른 이메일 형식이 아닙니다. 다시 입력해주세요.');
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
      this.service.deleteemailalarm(element.email).subscribe({
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
    element.setting = !element.setting;
    const data = {
      name: element.name,
      setting: element.setting,
    };
    this.service.oneemailsetting(data).subscribe({
      next: (res) => {},
      error: (err) => {},
      complete: () => {},
    });
  }

  allData: boolean;
  allData2: boolean;
  // 전체 sms 설정값 가져오기
  getallemail() {
    this.service.getallalarmemail().subscribe({
      next: (res) => {
        this.allData = res;
        this.allData2 = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  ngDoCheck(): void {
    if (this.allData2 != this.allData) {
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
}
