import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  DoCheck,
} from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';

declare const am5: any;
declare const am5xy: any;
declare const am5themes_Animated: any;

import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

import '../../../../assets/amchart/amcharts.js';
import '../../../../assets/amchart/serial.js';
import '../../../../assets/amchart/light.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy, DoCheck {
  @Output()
  newsituation = new EventEmitter<boolean>();
  customerCode = '';
  cols = 0;

  // http://api-2207.bs-soft.co.kr/docs#/Detection/push_one_detection_api_detections__deviceId__post
  // /api/detections/{deviceId}
  getcustomermapdata = {};
  socketdevicesdata = {};
  socketgraphdata = {};
  socketrecentdata = [];

  constructor(
    public router: Router,
    private service: ApiService,
    private WebsocketService: WebsocketService
  ) {}

  ngOnInit() {
    this.Starting();
  }

  ngDoCheck() {
    if (window.innerWidth <= 1290) {
      this.cols = 1;
    } else {
      this.cols = 2;
    }
  }

  ngOnDestroy(): void {
    this.WebsocketService.requestmessages.unsubscribe();
    this.getcustomermapdata = {};
    this.socketdevicesdata = {};
    this.socketgraphdata = {};
    this.socketrecentdata = [];
  }

  initrequest(res) {
    let requestmessage = { cmd: 'main', args: [res.customerCode] };
    this.WebsocketService.requestmessages.next(requestmessage);
  }

  getcurrentuser() {
    const token = sessionStorage.getItem('token');
    return new Promise((resolve, reject) => {
      this.service.getcurrentuser(token).subscribe({
        next: (res) => {
          this.customerCode = res['customerCode'];
          resolve(res);
        },
        error: (err) => {
          reject(new Error(err));
        },
      });
    });
  }

  getcustomermap(customer_code) {
    this.service.getcustomermap(customer_code).subscribe({
      next: (res) => {
        this.getcustomermapdata = res;
      },
      error: (err) => {},
    });
  }

  processData(msg) {
    if (msg.customerCode === this.customerCode) {
      if (msg['title'] === 'dashboard') {
        this.socketdevicesdata = msg.deviceNum?.content;
        this.socketrecentdata = msg.recentEvent?.content;
        this.socketgraphdata = msg.graph?.content;
        this.makechart('succeed', this.socketgraphdata);
      } else if (msg['title'] === 'event') {
        localStorage.setItem('popupdata', msg['popupEvent']['content']);
        this.socketrecentdata = msg['recentEvent']['content'];
        // this.socketgraphdata = msg['graph']['content'];
        localStorage.setItem('situation', JSON.stringify(true));
        // this.newsituation.emit(true);
      } else {
        this.socketdevicesdata = msg['content'];
      }
    }
  }

  getWebsocketdata() {
    this.WebsocketService.requestmessages.subscribe((msg) => {
      this.processData(msg);
    });
  }

  async Starting() {
    const getCurrentuser = await this.getcurrentuser();
    this.getcustomermap(getCurrentuser['customerCode']);
    this.getWebsocketdata();
    // 메세지 보내는 위치를 파악할수 없었음
    setTimeout(() => {
      this.initrequest(getCurrentuser);
    }, 50);
  }

  // 통계차트
  makechart = (res, socketgraphdata) => {
    if (res === 'succeed') {
      const dataset = [];
      for (let i = 0; i < socketgraphdata['Button'].length; i++) {
        dataset.push({
          Button: socketgraphdata['Button'][i],
          Scream: socketgraphdata['Scream'][i],
          Time: socketgraphdata['Time'][i],
        });
      }

      var root = am5.Root.new('chartdiv');

      root.setThemes([am5themes_Animated.new(root)]);

      root.dateFormatter.setAll({
        dateFormat: 'yyyy-MM-dd',
        dateFields: ['valueX'],
      });

      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          focusable: true,
          panX: false,
          panY: false,
          wheelY: 'zoomX',
          layout: root.verticalLayout,
        })
      );

      var data =
        // [{ Button: 14, Scream: 15, Time: '2020-02-01' }, { Button: 20, Scream: 15, Time: '2020-02-02' }, { Button: 7, Scream: 10, Time: '201909' }, { Button: 1, Scream: 4, Time: '201908' }];
        dataset;

      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: 'Time',
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {}),
        })
      );

      xAxis.data.setAll(data);

      var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          min: 0,
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );

      // Add legend
      // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
      var legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
        })
      );

      // set text,grid color white
      root.interfaceColors.set('grid', am5.color('#ffffff'));
      root.interfaceColors.set('text', am5.color('#ffffff'));
      root.interfaceColors.set('', am5.color('#ffffff'));

      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      function makeSeries(name: any, fieldName: any) {
        if (name === 'Button') {
          var series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
              fill: am5.color('#6794dc'),
              name: name,
              stacked: true,
              xAxis: xAxis,
              yAxis: yAxis,
              valueYField: fieldName,
              // valueYShow: "valueYTotalPercent",
              categoryXField: 'Time',
            })
          );
        } else {
          var series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
              fill: am5.color('#a367dc'),
              name: name,
              stacked: true,
              xAxis: xAxis,
              yAxis: yAxis,
              valueYField: fieldName,
              // valueYShow: "valueYTotalPercent",
              categoryXField: 'Time',
            })
          );
        }
        series.columns.template.setAll({
          maxWidth: 50,
          strokeOpacity: 0,
          tooltipText: '{name}, {categoryX}:{valueY}',
          tooltipY: am5.percent(10),
        });
        series.data.setAll(data);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear();

        series.bullets.push(function () {
          return am5.Bullet.new(root, {
            sprite: am5.Label.new(root, {
              text: '{valueY}',
              fill: root.interfaceColors.get('alternativeText'),
              centerY: am5.p50,
              centerX: am5.p50,
              populateText: true,
            }),
          });
        });
        legend.data.push(series);
      }

      makeSeries('Button', 'Button');
      makeSeries('Scream', 'Scream');

      xAxis.get('renderer').labels.template.setAll({
        fill: root.interfaceColors.get('alternativeText'),
      });

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
    }
  };
}
