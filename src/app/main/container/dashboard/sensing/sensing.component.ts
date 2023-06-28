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
          const myCustomerCode = res.customerCode
          const isHyperuser = res.is_hyperuser;
          this.service.alldetection(res.customerCode).subscribe({
            next: (res) => {
              let resData = [];
              if(isHyperuser) {
                resData = res;
              } else {
                resData = res.filter(item => myCustomerCode === item.customerCode);
              }
              this.datalist = resData.slice(0, 5);
              this.dataSource = resData.slice(0, 5);
            },
          });
        },
      });
    });
  }
}
