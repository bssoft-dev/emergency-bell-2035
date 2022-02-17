import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  
  constructor(public router: Router, private service:ApiService) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'userId': new FormControl("", [Validators.required]),
      'Email': new FormControl("",),
      'customerCode': new FormControl("", [Validators.required]),
      'name': new FormControl(""),
      'password': new FormControl("", [Validators.required,Validators.minLength(2),]),
      'confirmpassword': new FormControl("", [Validators.required,Validators.minLength(2),]),
    });
  }

  register(){
    const data = this.registerForm.value;

    if(this.registerForm.valid){
        if(this.registerForm.value.password === this.registerForm.value.confirmpassword){
          this.service.register(data).subscribe({
            next:(res) => { 
              alert('회원가입이 성공적으로 완료되었습니다. 로그인창으로 이동합니다')
              this.router.navigate(['/login']);
             },
            error:(err)=>{
              alert('이미 존재하거나 정보를 잘못 입력하셨습니다')
             },
            complete:()=> { 
            }
          });
        }else{
          alert('비밀번호가 다릅니다')
        }
    }else{
      alert('필수 항목을 입력해 주세요')
    }
  }

  gologin(){
    this.router.navigate(['/login']);
  }
}
