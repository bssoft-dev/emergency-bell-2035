import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  public modal: boolean = false;
  public modal2: boolean = false;
  fileSelected?: Blob;
  imageSrc: string;
  mapSrc: string;
  token = "";
  customer_code = "";

  modifyclientForm: FormGroup;
  registerclientForm: FormGroup;

  checktoken = () => {
    if (!sessionStorage.getItem("token")) {
      this.router.navigate(['/login']);
    }
  }

  constructor(public router: Router, private service: ApiService) { }

  currentusercheckdata = [];
  currentusercheck() {
    const token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(token).subscribe({
        next: (res) => {
          resolve(res);
          this.token = sessionStorage.getItem('token');
          this.customer_code = res.customerCode;
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {
        }
      })
    })
  }

  getcustomersdata = []
  initgetcustomers(res) {
    this.getcustomersdata = [];
    const temp = [sessionStorage.getItem('token'), res.customerCode]
    this.getcustomersdata = [];
    this.service.getallcustomers(temp).subscribe({
      next: (res) => {
        this.getcustomersdata = res;
      },
      error: (err) => {

      },
      complete: () => {
      }
    });
  }

  getcustomers() {
    this.getcustomersdata = [];
    const temp = [this.token, this.customer_code]
    this.getcustomersdata = [];
    this.service.getallcustomers(temp).subscribe({
      next: (res) => {
        this.getcustomersdata = res;
      },
      error: (err) => {

      },
      complete: () => {
      }
    });
  }


  clickedModal() {
    this.modal = true;
  }
  clickedModalClose() {
    this.modifyclientForm.reset()
    this.registerclientForm.reset()
    this.modal = false;
  }

  clickedModal2Close() {
    this.modifyclientForm.reset()
    this.registerclientForm.reset()
    this.modal2 = false;
    this.imageSrc = "";
  }
  clickedModal2() {
    this.modal2 = true;
  }


  ngOnInit() {
    this.checktoken();
    this.currentusercheck().then(res => {
      this.initgetcustomers(res)
    })
    this.modifyclientForm = new FormGroup({
      'customerName': new FormControl("", [Validators.required]),
      'staffName': new FormControl("",),
      'phone': new FormControl("", [Validators.required]),
      'status': new FormControl("",),
      'payMethod': new FormControl("",),
      'logo': new FormControl("",),
      'map': new FormControl("",),

    });
    this.registerclientForm = new FormGroup({
      'customerName': new FormControl("", [Validators.required]),
      'staffName': new FormControl("",),
      'phone': new FormControl("", [Validators.required]),
      'status': new FormControl("",),
      'payMethod': new FormControl("",),
      'logo': new FormControl("",),
      'map': new FormControl("",),
    });

  }

  getonecustomerdata = []
  getOnecustomers(index) {
    this.getonecustomerdata = [];
    this.modal2 = true;
    this.getonecustomerdata.push(this.getcustomersdata[index])
    this.imageSrc = this.getonecustomerdata[0]["logo"]
    this.modifyclientForm.patchValue({
      customerName: this.getonecustomerdata[0]["customerName"],
      staffName: this.getonecustomerdata[0]["staffName"],
      phone: this.getonecustomerdata[0]["phone"],
      status: this.getonecustomerdata[0]["status"],
      payMethod: this.getonecustomerdata[0]["payMethod"],
      logo: this.getonecustomerdata[0]["logo"],
      map: this.getonecustomerdata[0]["map"],
    })

  }

  onFileChange(event, index): void {
    this.fileSelected = event.target.files[0]
    const formData = new FormData();
    formData.append(
      "file",
      this.fileSelected
    );

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        if (index === 1) {
          this.imageSrc = res.url;
          this.modifyclientForm.patchValue({
            logo: this.imageSrc
          })
          this.registerclientForm.patchValue({
            logo: this.imageSrc
          })
        } else {
          this.mapSrc = res.url;
          this.modifyclientForm.patchValue({
            map: this.mapSrc
          })
          this.registerclientForm.patchValue({
            map: this.mapSrc
          })
        }

      },
      error: (err) => {
        alert('서버 에러메세지')
      },
      complete: () => {
      }
    });
  }


  registeronecustomer() {
    const data = this.registerclientForm.value;
    if (data['logo'].length < 1) {
      data['logo'] = "http://api-2207.bs-soft.co.kr/api/images/person-fill.svg"
    }
    if (data['map'].length < 1) {
      data['map'] = "http://api-2207.bs-soft.co.kr/api/images/map.png"
    }
    if (this.registerclientForm.valid) {
      this.service.registeronecustomer(data).subscribe({
        next: (res) => {
          alert('고객사 등록이 완료되었습니다')
          this.getcustomers()
          this.registerclientForm.reset()
          this.modal = false;
        },
        error: (err) => {
          alert('정보를 잘못 입력하셨습니다')
        },
        complete: () => {
        }
      });
    } else {
      alert('정보를 입력해주세요')
    }
  }

  modifyonecustomer() {
    const temp = [];
    temp.push(this.getonecustomerdata[0]["customerCode"])
    const data = this.modifyclientForm.value;
    temp.push(data)
    if (this.modifyclientForm.valid) {
      this.service.modifyonecustomer(temp).subscribe({
        next: (res) => {
          alert('고객사 수정이 완료되었습니다')
          this.getcustomers()
          this.modifyclientForm.reset()
          this.modal2 = false;
        },
        error: (err) => {
          alert('정보를 잘못 입력하셨습니다')
        },
        complete: () => {
        }
      });
    } else {
      alert('정보를 입력해주세요')
    }
  }

  deleteonecustomer(i) {
    const returnValue = confirm('고객사를 삭제 하시겠습니까?')
    if (returnValue) {
      const temp = this.getcustomersdata[i]['customerCode']
      this.service.deleteonecustomer(temp).subscribe({
        next: (res) => {
          this.getcustomers()
        },
        error: (err) => {
        },
        complete: () => {
        }
      });
    }

  }

}
