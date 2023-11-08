import { Component, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sensing',
  templateUrl: './sensing.component.html',
  styleUrls: ['./sensing.component.css', '../../container.table.css'],
})
export class SensingComponent  {
  @Input() socketrecentdata = [];

  displayedColumns = ['time', 'location', 'type'];
  dataSource = [];

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.dataList();
  }

  datalist = [];
  dataList() {
    return new Promise((resolve, reject) => {
      const token = sessionStorage.getItem('token');
      this.service.getcurrentuser(token).subscribe({
        next: (res) => {
          this.service.alldetection(res.customerCode).subscribe({
            next: (res) => {
              this.datalist = res.slice(0, 5);
              this.dataSource = res.slice(0, 5);
            },
            error: (err) => {},
          });
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
      });
    });
  }
}
