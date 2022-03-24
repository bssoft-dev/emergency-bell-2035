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
  public modal2: boolean = false;
  deviceenrollForm: FormGroup;

  checktoken = () => {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
    }
  }

  constructor(public router: Router, private service: ApiService) { }

  getcustomersdata = []
  getcustomers() {
    this.service.getallcustomers().subscribe({
      next: (res) => {
        this.getcustomersdata.push(res)
      },
      error: (err) => {
        // localStorage.removeItem('customer_code')
        // localStorage.removeItem('token')
        // alert('로그인이 만료되었습니다. 로그인창으로 이동합니다')
        // this.router.navigate(['/login']);
      },
      complete: () => {
      }
    });
  }

  clickedModal2Close() {
    this.modal2 = false;

  }
  clickedModal2() {
    this.modal2 = true;
  }
  modifyonedevice() {

  }

  ngOnInit() {

    this.checktoken();
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
    setTimeout(() => {
      this.getcustomers()
    }, 500)
  }

  getOneClient() {
    this.clickedModal2()
  }

  deleteoneClient() {
    const returnValue = confirm('고객사를 삭제 하시겠습니까?')
    console.log('기기기', returnValue);

  }

}
