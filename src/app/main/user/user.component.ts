import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public modal: boolean = false;
  public modal2: boolean = false;
  modifyuserForm: FormGroup;
  authority = false;
  token = "";
  customer_code = "";



  ids = ['switch1', 'switch2']
  event: any;

  checktoken = () => {
    if (!sessionStorage.getItem("token")) {
      this.router.navigate(['/login']);
    }
  }

  constructor(public router: Router, private service: ApiService,) { }

  clickedModalClose() {
    this.modifyuserForm.reset()
    this.modal = false;
  }
  clickedModal() {
    this.modal = true;
  }
  clickedModal2Close() {
    this.modifyuserForm.reset()
    this.modal2 = false;
  }
  clickedModal2() {
    this.modal2 = true;
  }
  modifyonedevice() {

  }

  getallusersdata = [];
  getallusers() {
    const temp = [this.token, this.customer_code]

    this.getallusersdata = [];
    console.log(this.getallusersdata, 'dkdkdk')


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
    this.token = sessionStorage.getItem('token')
    this.customer_code = sessionStorage.getItem('customer_code')
    this.checktoken()
    this.getallusers()
    this.modifyuserForm = new FormGroup({
      'username': new FormControl("",),
      'name': new FormControl("",),
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


  checkauthority() {
    const myname = sessionStorage.getItem('myname')
    if (myname == 'hyper') {
      this.authority = true;
    } else {
      for (let i of this.getallusersdata[0]) {
        if (i.username === myname) {
          if (i.is_superuser == true || i.is_hyperuser == true) {
            this.authority = true;
          }
        }
      }
    }
  }

  getCheckboxValue(index) {
    this.checkauthority();

    if (this.authority) {
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
    this.checkauthority();

    if (this.authority) {
      this.modal2 = true;
      this.getoneuserdata = this.getallusersdata[0][index]

      this.modifyuserForm.patchValue({
        username: this.getoneuserdata["username"],
        name: this.getoneuserdata["name"],
        phone: this.getoneuserdata["phone"],
        email: this.getoneuserdata["email"],
      })
    } else {
      alert('회원님은 관리자 권한이 없습니다')
      this.getallusers();
    }
  }

  deleteoneUser() {
    this.checkauthority();
    if (this.authority) {
      const returnValue = confirm('회원을 삭제 하시겠습니까?')
      if (returnValue) {
        this.service.deleteoneuser(this.getoneuserdata["username"]).subscribe({
          next: (res) => {
            console.log(res, 'res')
            this.getallusers()
          },
          error: (err) => {

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
