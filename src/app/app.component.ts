import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  chart = [];

  myDataArray = [];

  chartType = 0;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor(public router: Router) {

  }

  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    var primaryColor = getComputedStyle(document.body).getPropertyValue('--primary');
    var secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary');
    var successColor = getComputedStyle(document.body).getPropertyValue('--success');
    var warningColor = getComputedStyle(document.body).getPropertyValue('--warning');
    var dangerColor = getComputedStyle(document.body).getPropertyValue('--danger');
    var infoColor = getComputedStyle(document.body).getPropertyValue('--info');
    var darkColor = getComputedStyle(document.body).getPropertyValue('--dark');
    var lightColor = getComputedStyle(document.body).getPropertyValue('--light');

    var type = 'doughnut';
    var doughnutPieData = {
      datasets: [{
        data: [52, 28, 20],
        backgroundColor: [
          dangerColor,
          successColor,
          primaryColor,
        ],
        borderColor: [
          dangerColor,
          successColor,
          primaryColor
        ],
      }],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
        'Scream',
        'Faint, Fall',
        'Other'
      ]
    };
    var doughnutPieOptions = {
      cutoutPercentage: 75,
      animationEasing: "easeOutBounce",
      animateRotate: true,
      animateScale: false,
      responsive: true,
      maintainAspectRatio: true,
      showScale: true,
      legend: {
        display: false
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      }
    };




  }

}
