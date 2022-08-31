import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-alldetection',
  templateUrl: './alldetection.component.html',
  styleUrls: ['../container.table.css', './alldetection.component.css'],
})
export class AlldetectionComponent implements OnInit {
  // displayedColumns = ['index', 'name', 'time', 'type', 'location'];
  displayedColumns = ['name', 'time', 'type', 'location'];

  dataSource = [];

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.dataList();
    console.log('dataSource : ', this.dataSource);
    console.log('datalist : ', this.datalist);
  }

  datalist = []; // 사용자데이터
  dataList() {
    return new Promise(() => {
      this.service.getcurrentuser(sessionStorage.getItem('token')).subscribe({
        next: (res) => {
          console.log(res);
          this.service.alldetection(res.customerCode).subscribe({
            next: (res) => {
              console.log('res : ', res);
              this.datalist = res;
              this.dataSource = res;
            },
          });
        },
      });
    });
  }
}
