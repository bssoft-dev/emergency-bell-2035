import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-alldetection',
  templateUrl: './alldetection.component.html',
  styleUrls: ['./alldetection.component.css', '../container.component.css'],
})
export class AlldetectionComponent implements OnInit {
  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.dataList();
  }

  datalist = []; // 사용자데이터
  dataList() {
    return new Promise(() => {
      this.service.getcurrentuser(sessionStorage.getItem('token')).subscribe({
        next: (res) => {
          console.log(res);
          this.service.alldetection(res.customerCode).subscribe({
            next: (res) => {
              this.datalist.push(res);
            },
          });
        },
      });
    });
  }
}
