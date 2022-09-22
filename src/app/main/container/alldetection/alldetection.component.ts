import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-alldetection',
  templateUrl: './alldetection.component.html',
  styleUrls: ['../container.table.css', './alldetection.component.css'],
})
export class AlldetectionComponent implements OnInit {
  @Input() userLog = [];

  displayedColumns = ['index','name', 'time', 'type', 'location'];

  dataSource = [];

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.dataList();
  }

  datalist = []; // 사용자데이터
  dataList() {
    return new Promise(() => {
      this.service.getcurrentuser(sessionStorage.getItem('token')).subscribe({
        next: (res) => {
          this.service.alldetection(res.customerCode).subscribe({
            next: (res) => {
              this.datalist = res;
              this.dataSource = res;
            },
          });
        },
      });
    });
  }
}
