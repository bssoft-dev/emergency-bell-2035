import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { JsonFormatter } from 'tslint/lib/formatters';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public modal: boolean = false;
  public modal2: boolean = false;
  registeruserForm: FormGroup;
  modifyuserForm: FormGroup;
  is_hyperuser = false;
  is_superuser = false;
  token = "";
  customer_code = "";

  event: any;

  checktoken = () => {
    if (!sessionStorage.getItem("token")) {
      this.router.navigate(['/login']);
    }
  }

  constructor(public router: Router, private service: ApiService,) { }

  currentusercheckdata = [];
  currentusercheck() {
    const token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(token).subscribe({
        next: (res) => {
          resolve(res);
          this.token = sessionStorage.getItem('token');
          this.customer_code = res.customerCode;
          this.is_superuser = res.is_superuser;
          this.is_hyperuser = res.is_hyperuser;
        },
        error: (err) => {
          reject(new Error(err));
        },
        complete: () => {
        }
      })
    })
  }

  clickedModalClose() {
    this.registeruserForm.reset()
    this.modal = false;
  }
  clickedModal() {
    console.log(this.customerNames)
    this.modal = true;
  }
  clickedModal2Close() {
    this.modifyuserForm.reset()
    this.modal2 = false;
  }
  clickedModal2() {
    this.modal2 = true;
  }

  customerNames = [];
  initGetCustomerNames() {
    const temp = sessionStorage.getItem('token')
    this.customerNames = [];
    this.service.getCustomerNames(temp).subscribe({
      next: (res) => {
        this.customerNames = res
      },
      error: (err) => {
        console.log(err, 'err')
      },
      complete: () => {
      }
    });
  }


  getallusersdata = [];
  initgetallusers(res) {
    const temp = [sessionStorage.getItem('token'), res.customerCode]
    this.getallusersdata = [];
    this.service.getallusers(temp).subscribe({
      next: (res) => {
        this.getallusersdata.push(res)
      },
      error: (err) => {
        console.log(err, 'err')
      },
      complete: () => {
      }
    });
  }

  getallusers() {
    const temp = [this.token, this.customer_code]

    this.getallusersdata = [];
    this.service.getallusers(temp).subscribe({
      next: (res) => {
        this.getallusersdata.push(res)
      },
      error: (err) => {
        console.log(err, 'err')
      },
      complete: () => {
      }
    });
  }

  registerUser() {

    console.log('registerUser', this.registeruserForm.value)
    const data = this.registeruserForm.value
    data.password = data.passwordGroup.password
    delete data.passwordGroup;
    // if (this.registeruserForm.valid) {
    //   this.service.registeruser(data).subscribe({
    //     next: (res) => {
    //       alert('회원 등록이 완료되었습니다')
    //       this.getallusers()
    //       this.registeruserForm.reset()
    //       this.modal = false;
    //     },
    //     error: (err) => {

    //     },
    //     complete: () => {
    //     }
    //   });
    // } else {
    //   alert('입력을 확인해주세요')
    //   this.getallusers();
    // }
  }

  equalValidator({ value }: FormGroup): { [key: string]: any } {
    const [first, ...rest] = Object.keys(value || {});
    if (first.length == 0 && rest.length == 0) {
      return
    } else {
      const valid = rest.every(v => value[v] === value[first]);
      return valid ? null : { equal: true };
    }
  }


  ngOnInit() {
    this.checktoken()
    this.currentusercheck().then(res => {
      this.initgetallusers(res)
    })
    this.initGetCustomerNames()

    this.modifyuserForm = new FormGroup({
      'username': new FormControl("", [Validators.required,]),
      'name': new FormControl("",),
      'customerName': new FormControl("",),
      'phone': new FormControl("",),
      'email': new FormControl("",),
      'passwordGroup': new FormGroup({
        'password': new FormControl("", [Validators.required]),
        'passwordconfirm': new FormControl("", [Validators.required,]),
      }, this.equalValidator)
    });
    this.registeruserForm = new FormGroup({
      'username': new FormControl("", [Validators.required,]),
      'name': new FormControl("",),
      'customerName': new FormControl("",),
      'phone': new FormControl("",),
      'email': new FormControl("",),
      'passwordGroup': new FormGroup({
        'password': new FormControl("", [Validators.required]),
        'passwordconfirm': new FormControl("", [Validators.required,]),
      }, this.equalValidator)
    });
  }

  ngOnDestroy() {
    this.getallusersdata = [];
    this.getoneuserdata = [];
  }


  overlapcheck = false;
  usernamechange(e) {
    this.overlapcheck = false;
  }

  duplicatecheck() {
    const data = this.registeruserForm.controls.username.value
    if (data.length > 0) {
      this.service.duplicatecheck(data).subscribe({
        next: (res) => {
          if (res == '생성 가능한 아이디 입니다') {
            this.overlapcheck = true;
          } else {
            this.overlapcheck = false;
          }
        },
        error: (err) => {
          alert('서버 에러')
        },
        complete: () => {
        }
      });
    }
  }


  modifymanager(index) {
    if (this.is_hyperuser || this.is_superuser) {
      this.getallusersdata[0][index].is_superuser = !this.getallusersdata[0][index].is_superuser
      const temp = []
      const jsontemp = { "is_superuser": this.getallusersdata[0][index].is_superuser }
      temp.push(this.getallusersdata[0][index].username)
      temp.push(jsontemp)
      this.service.usersupergrant(temp).subscribe({
        next: (res) => {
          console.log(res, 'res')
        },
        error: (err) => {

        },
        complete: () => {
        }
      });
    } else {
      alert('관리자 권한이 없습니다')
      this.getallusers();
    }
  }


  getoneuserdata = [];
  getOneUser(index) {
    if (this.is_hyperuser || this.is_superuser) {
      this.modal2 = true;
      this.getoneuserdata = this.getallusersdata[0][index]

      this.modifyuserForm.patchValue({
        username: this.getoneuserdata["username"],
        name: this.getoneuserdata["name"],
        customerName: this.getoneuserdata["customerName"],
        phone: this.getoneuserdata["phone"],
        email: this.getoneuserdata["email"],
      })
    } else {
      alert('회원님은 관리자 권한이 없습니다')
      this.getallusers();
    }
  }

  deleteoneUser(index) {
    if (this.is_hyperuser || this.is_superuser) {
      const returnValue = confirm('회원을 삭제 하시겠습니까?')
      if (returnValue) {
        console.log('쳌쳌', this.getallusersdata[0][index]['username'])
        this.service.deleteoneuser(this.getallusersdata[0][index]['username']).subscribe({
          next: (res) => {
            alert('삭제 완료')
            this.getallusers();
          },
          error: (err) => {
            alert('서버 에러')
          },
          complete: () => {
          }
        });
      }
    } else {
      alert('회원님은 관리자 권한이 없습니다')
      this.getallusers();
    }
  }



  cantmatch = ""
  modifyoneUser() {
    if (this.modifyuserForm.value.password != this.modifyuserForm.value.passwordconfirm) {
      this.cantmatch = "비밀번호가 일치하지 않습니다"
    } else {
      const temp = []
      const jsontemp = {
        "username": this.modifyuserForm.value.username,
        "name": this.modifyuserForm.value.name,
        "customerName": this.modifyuserForm.value.customerName,
        "phone": this.modifyuserForm.value.phone,
        "email": this.modifyuserForm.value.email,
        "password": this.modifyuserForm.value.password,
      }
      temp.push(this.getoneuserdata["username"])
      temp.push(jsontemp)
      this.service.modifyoneuser(temp).subscribe({
        next: (res) => {
          alert('회원 수정이 완료되었습니다')
          this.getallusers()
          this.modifyuserForm.reset()
          this.modal2 = false;
        },
        error: (err) => {

        },
        complete: () => {
        }
      });
    }
  }


}
