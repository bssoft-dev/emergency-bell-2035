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
  fileSelected?: Blob;
  imageSrc: string;

  modifyclientForm: FormGroup;

  checktoken = () => {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
    }
  }

  constructor(public router: Router, private service: ApiService) { }

  getcustomersdata = []
  getcustomers() {
    this.getcustomersdata = [];
    this.service.getallcustomers().subscribe({
      next: (res) => {
        this.getcustomersdata.push(res)
        console.log(this.getcustomersdata[0]);
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
    this.modifyclientForm.reset()
    this.modal2 = false;
    this.imageSrc = "";
  }
  clickedModal2() {
    this.modal2 = true;
  }

  modifyonedevice() {

  }

  ngOnInit() {

    this.checktoken();
    this.modifyclientForm = new FormGroup({
      'name': new FormControl("", [Validators.required]),
      'staffName': new FormControl("", [Validators.required]),
      'phone': new FormControl("",),
      'status': new FormControl("",),
      'payMethod': new FormControl("",),
      'installMap': new FormControl("",),
    });
    this.getcustomers()
  }

  getoneclientdata = []
  getOneClient(index) {
    this.modal2 = true;
    this.getoneclientdata = this.getcustomersdata[index]
    console.log(this.getoneclientdata, 'dkdkdk')

    this.modifyclientForm.patchValue({
      name: this.getoneclientdata["name"],
      staffName: this.getoneclientdata["staffName"],
      phone: this.getoneclientdata["phone"],
      status: this.getoneclientdata["status"],
      payMethod: this.getoneclientdata["payMethod"],
      installMap: this.getoneclientdata["installMap"],
    })

  }

  onFileChange(event): void {
    this.fileSelected = event.target.files[0]
    const formData = new FormData();
    formData.append(
      "file",
      this.fileSelected
    );

    this.service.uploadanal(formData).subscribe({
      next: (res) => {
        this.imageSrc = res.url;
        this.modifyclientForm.patchValue({
          installMap: this.imageSrc
        })
      },
      error: (err) => {
        alert('서버 에러메세지')
      },
      complete: () => {
      }
    });
  }


  deleteoneClient(i) {
    const returnValue = confirm('고객사를 삭제 하시겠습니까?')
    console.log('기기기', returnValue);
    if (returnValue) {
      const temp = this.getcustomersdata[0][i]['customerCode']
      this.service.deleteonecustomer(temp).subscribe({
        next: (res) => {
          console.log('삭제', res);
          this.getcustomers()
        },
        error: (err) => {
          console.log('삭제', err);
        },
        complete: () => {
        }
      });
    }

  }

}
