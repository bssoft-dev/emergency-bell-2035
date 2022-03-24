import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public modal2: boolean = false;
  deviceenrollForm: FormGroup;


  checking = "checked"
  event: any;

  checktoken = () => {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
    }
  }

  constructor(public router: Router,) { }

  clickedModal2Close() {
    this.modal2 = false;

  }
  clickedModal2() {
    this.modal2 = true;
  }
  modifyonedevice() {

  }

  ngOnInit() {
    this.checktoken()
    this.deviceenrollForm = new FormGroup({
      'deviceId': new FormControl("", [Validators.required]),
      'name': new FormControl("", [Validators.required]),
      'model': new FormControl("", [Validators.required]),
      'location': new FormControl("",),
      'installDate': new FormControl("",),
      'picture': new FormControl("",),
      'communicateMethod': new FormControl("",),
      'userMemo': new FormControl("",),
    });
  }


  getCheckboxValue() {
    if (this.checking === "") {
      this.checking = "checked"
      console.log(this.checking)

    } else {
      this.checking = ""
      console.log(this.checking)
    }

  }

  getOneUser() {
    this.clickedModal2()
  }

  deleteoneUser() {
    const returnValue = confirm('회원을 삭제 하시겠습니까?')
    console.log('기기기', returnValue);

  }


}
