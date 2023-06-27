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
    return new Promise(() => {
      this.service.getcurrentuser(sessionStorage.getItem('token')).subscribe({
        next: (res) => {
          this.service.alldetection(res.customerCode).subscribe({
            next: (res) => {
              this.datalist = res.slice(0, 5);
              this.dataSource = res.slice(0, 5);
            },
          });
        },
      });
    });
  }
}
