import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  registeremailForm: FormGroup;
  registersmsForm: FormGroup;

  public modal: boolean = false;
  token = "";
  customer_code = "";
  is_hyperuser;
  corplogo;

  tabtitle = ['휴대폰', '이메일']
  tab1 = true;
  tab2 = false;
  selectedtab = '휴대폰';

  constructor(public router: Router, private service: ApiService) { }



  currentusercheckdata = [];
  currentusercheck() {
    this.token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(this.token).subscribe({
        next: (res) => {
          this.token = sessionStorage.getItem('token');
          this.customer_code = res.customerCode;
          this.is_hyperuser = res.is_hyperuser;
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {
        }
      })
    })
  }

  getonecustomerslogo(res) {
    const temp = [sessionStorage.getItem('token'), res.customerCode]
    this.service.getoncustomerslogo(temp).subscribe({
      next: (res) => {
        this.corplogo = res['logo']
      },
      error: (err) => {
      },
      complete: () => {
      }
    });
  }

  myname = "";

  ngOnInit() {
    this.registersmsForm = new FormGroup({
      'name': new FormControl("", [Validators.required]),
      'phone': new FormControl("", [Validators.required]),
    });
    this.registeremailForm = new FormGroup({
      'name': new FormControl("", [Validators.required]),
      'email': new FormControl("", [Validators.required]),
    });
    this.token = sessionStorage.getItem('token')
    this.currentusercheck().then((res) => {
      this.myname = res['name'];
      this.getonecustomerslogo(res)
    })

  }

  logout() {
    sessionStorage.removeItem("token")
    this.router.navigate(['/login'])
  }

  active = [];

  outputEvent(active: any) {
    this.active = active;
  }

  clickedModalClose() {
    this.modal = false;
  }
  clickedModal() {
    this.modal = true;
    this.getalarmsmsuser();
    this.getalaremailuser();
  }

  selecttab(title) {
    this.selectedtab = title;
    if (title === '휴대폰') {
      this.tab1 = true;
      this.tab2 = false;
    } else {
      this.tab1 = false;
      this.tab2 = true;
    }
  }

  changetoggle() {

  }

  challtoggle() {

  }

  getalarmsmsdata = [];
  getalarmsmsuser() {
    this.getalarmsmsdata = [];
    this.service.getalarmsmsuser().subscribe({
      next: (res) => {
        this.getalarmsmsdata = res;
        console.log(this.getalarmsmsdata)
      },
      error: (err) => {
      },
      complete: () => {
      }
    });
  }

  getalarmemaildata = [];
  getalaremailuser() {
    this.getalarmemaildata = [];
    this.service.getalarmemailuser().subscribe({
      next: (res) => {
        this.getalarmemaildata = res;
        console.log(this.getalarmemaildata)

      },
      error: (err) => {
        console.log(err, 'dll')
      },
      complete: () => {
      }
    });
  }

  registeremailuser() {
    console.log(this.registeremailForm.value)
    this.service.registeremailalarm(this.registeremailForm.value).subscribe({
      next: (res) => {
        this.getalaremailuser();
        this.registeremailForm.reset();
      },
      error: (err) => {
        alert('서버 에러')
        console.log(err)
      },
      complete: () => {
      }
    });
  }

  registersmsuser() {
    console.log(this.registersmsForm.value)
    this.service.registersmsalarm(this.registersmsForm.value).subscribe({
      next: (res) => {
        this.getalarmsmsuser();
        this.registersmsForm.reset();
      },
      error: (err) => {
        alert('서버 에러')
        console.log(err, 'dll')

      },
      complete: () => {
      }
    });
  }

  deletesmsalarm(index) {
    console.log(index)
    const data = this.getalarmsmsdata[index];
    console.log(data.phone)

    this.service.deletesmsalarm(data.phone).subscribe({
      next: (res) => {
        alert('삭제 완료 되었습니다.')
        this.getalarmsmsuser();
      },
      error: (err) => {

      },
      complete: () => {
      }

    })
  }
  deleteemailalarm(index) {
    const data = this.getalarmemaildata[index];
    console.log(data.email)

    this.service.deleteemailalarm(data.email).subscribe({
      next: (res) => {
        alert('삭제 완료 되었습니다.')
        this.getalaremailuser();
      },
      error: (err) => {

      },
      complete: () => {
      }

    })
  }


}
