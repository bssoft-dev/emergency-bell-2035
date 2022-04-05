import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from "../../services/websocket.service";

declare const am5: any;
declare const am5xy: any;
declare const am5themes_Animated: any;

import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';


import '../../../assets/amchart/amcharts.js';
import '../../../assets/amchart/serial.js';
import '../../../assets/amchart/light.js';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [WebsocketService]
})

export class DashboardComponent implements OnInit, OnDestroy {
    public modal: boolean = false;


    checktoken = () => {
        if (!sessionStorage.getItem("token")) {
            this.router.navigate(['/login']);
        }
    }



    // websocket 템프 데이터
    requestreceived = [];
    // websocket 알림 데이터
    popupdata = [];
    // websocket 토탈 데이터
    socketconnectdata = [];
    socketdevicesdata = [];
    socketgraphdata = [];
    sockethistorydata = [];
    socketrecentdata = [];
    socketmapdata = [];

    constructor(public router: Router, private service: ApiService, private WebsocketService: WebsocketService) {
        WebsocketService.messages.subscribe(msg => {

            this.requestreceived.push(msg);
            console.log("Response from websocket: ", msg);

            if (Object.keys(msg).length >= 3) {
                this.socketconnectdata = this.requestreceived[0]?.connect?.content;
                this.socketdevicesdata = this.requestreceived[0]?.devices?.content;
                this.socketgraphdata = this.requestreceived[0]?.graph?.content;
                this.sockethistorydata = this.requestreceived[0]?.history?.content;
                this.socketrecentdata = this.requestreceived[0]?.recent?.content;
                this.socketmapdata = this.requestreceived[0]?.map?.content;
                this.requestreceived = [];
            } else {
                for (let i of this.requestreceived) {
                    if (i.title === "recent") {
                        this.socketrecentdata = i.content;
                    } else if (i.title === "history") {
                        this.sockethistorydata = i.content;
                    } else {
                        this.popupdata = i.content;
                        if (this.popupdata) {
                            this.modal = true;
                        }
                    }
                }
            }
        });

    }

    initrequest() {
        const customer_code = sessionStorage.getItem("customer_code")
        setTimeout(() => {
            let requestmessage = { cmd: "main", args: [customer_code] }
            this.WebsocketService.requestmessages.next(requestmessage);
        }, 100)
    }

    makechart = (socketgraphdata) => {
        const dataset = []
        for (let i = 0; i < socketgraphdata["Button"].length; i++) {
            dataset.push({ Button: socketgraphdata["Button"][i], Scream: socketgraphdata["Scream"][i], Time: socketgraphdata["Time"][i] })
        }


        var root = am5.Root.new("chartdiv");


        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        root.dateFormatter.setAll({
            dateFormat: "yyyy-MM-dd",
            dateFields: ["valueX"]
        });

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {

            focusable: true,
            panX: false,
            panY: false,
            wheelY: "zoomX",
            layout: root.verticalLayout
        }));

        var data =
            // [{ Button: 14, Scream: 15, Time: '2020-02-01' }, { Button: 20, Scream: 15, Time: '2020-02-02' }, { Button: 7, Scream: 10, Time: '201909' }, { Button: 1, Scream: 4, Time: '201908' }];
            dataset;



        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "Time",
            renderer: am5xy.AxisRendererX.new(root, {}),
            tooltip: am5.Tooltip.new(root, {})
        }));

        xAxis.data.setAll(data);




        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            min: 0,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        var legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50
        }));

        // set text,grid color white
        root.interfaceColors.set("grid", am5.color("#ffffff"));
        root.interfaceColors.set("text", am5.color("#ffffff"));

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        function makeSeries(name: any, fieldName: any) {
            if (name === "Button") {
                var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    fill: am5.color("#6794dc"),
                    name: name,
                    stacked: true,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: fieldName,
                    // valueYShow: "valueYTotalPercent",
                    categoryXField: "Time"
                }));
            } else {
                var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    fill: am5.color("#a367dc"),
                    name: name,
                    stacked: true,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: fieldName,
                    // valueYShow: "valueYTotalPercent",
                    categoryXField: "Time"
                }));
            }
            series.columns.template.setAll({
                maxWidth: 50,
                strokeOpacity: 0,
                tooltipText: "{name}, {categoryX}:{valueY}",
                tooltipY: am5.percent(10),
            });
            series.data.setAll(data);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear();

            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                    sprite: am5.Label.new(root, {
                        text: "{valueY}",
                        fill: root.interfaceColors.get("alternativeText"),
                        centerY: am5.p50,
                        centerX: am5.p50,
                        populateText: true
                    })
                });
            });
            legend.data.push(series);
        }


        makeSeries("Button", "Button");
        makeSeries("Scream", "Scream");

        xAxis.get("renderer").labels.template.setAll({
            fill: root.interfaceColors.get("alternativeText")
        });

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/

    }


    ngOnInit() {
        this.checktoken()
        // this.detectiongraph()
        // this.detectionstatus()
        // this.alldevice()
        // this.alivecheck()
        // this.alldetection()
        this.initrequest()

        setTimeout(() => {
            this.makechart(this.socketgraphdata)
        }, 300)

    }

    ngOnDestroy(): void {
        this.WebsocketService.messages.unsubscribe();
    }

    clickedModalClose() {
        this.modal = false;
    }
}








