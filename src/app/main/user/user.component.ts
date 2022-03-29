import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';




@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public modal2: boolean = false;
  modifyuserForm: FormGroup;


  checking = [true, false]
  ids = ['switch1', 'switch2']
  event: any;

  checktoken = () => {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
    }
  }

  constructor(public router: Router, private service: ApiService,) { }

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
    const data = "ds"
    this.service.getallusers(data).subscribe({
      next: (res) => {
        this.getallusersdata.push(res)
      },
      error: (err) => {

      },
      complete: () => {
      }
    });
  }

  ngOnInit() {
    this.checktoken()
    this.getallusers()
    this.modifyuserForm = new FormGroup({
      'name': new FormControl("",),
      'phone': new FormControl("",),
      'email': new FormControl("",),
      'password': new FormControl("", [Validators.required]),
      'passwordconfirm': new FormControl("", [Validators.required]),
    });
  }


  getCheckboxValue(index) {
    this.getallusersdata[0][index].is_superuser = !this.getallusersdata[0][index].is_superuser
    const temp = []
    const jsontemp = { "is_superuser": this.getallusersdata[0][index].is_superuser }
    temp.push(this.getallusersdata[0][index].username)
    temp.push(jsontemp)
    console.log(temp, 'temp')
    this.service.usersupergrant(temp).subscribe({
      next: (res) => {

      },
      error: (err) => {

      },
      complete: () => {
      }
    });

  }

  getoneuserdata = [];
  getOneUser(index) {
    this.modal2 = true;
    this.getoneuserdata = this.getallusersdata[0][index]

    this.modifyuserForm.patchValue({
      name: this.getoneuserdata["name"],
      phone: this.getoneuserdata["phone"],
      email: this.getoneuserdata["email"],
    })
  }

  deleteoneUser() {
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
  }

  detectEvent(event) {
    console.log(event, 'event')
  }

  isUnchanged = true;
  modifyoneUser() {
    console.log(this.modifyuserForm.value, 'modifyoneUser')
  }


}
