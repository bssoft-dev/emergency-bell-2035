import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


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
