import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-alldetection',
  templateUrl: './alldetection.component.html',
  styleUrls: ['../container.table.css', './alldetection.component.css'],
})
export class AlldetectionComponent implements OnInit {
  @Input() userLog = [];

  displayedColumns = ['index','name', 'time', 'type', 'location'];

  dataSource: any;
  length:number;
  pageSize: number = 10;
  currentPage = 0;
  totalSize = 0;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private service: ApiService) {}

  ngDoCheck() {
    if (window.innerWidth <= 576) {
      this.pageSize = 10;
    } else {
      this.pageSize = 15;
    }
  }
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize;
    this.iterator();
  }

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
              this.dataSource = new MatTableDataSource<Element>(res);
              this.length = res.length;
              this.dataSource.paginator = this.paginator;
              this.totalSize = this.datalist.length;
              this.iterator();
            },
          });
        },
      });
    });
  }
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.datalist.slice(start, end);
    this.dataSource = part;
  }
}
