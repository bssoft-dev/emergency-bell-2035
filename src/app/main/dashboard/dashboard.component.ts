import { Component, OnInit } from '@angular/core';
declare const am5: any;
declare const am5xy: any;
declare const am5themes_Animated: any;
import * as mapboxgl from 'mapbox-gl';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';


import '../../../assets/amchart/amcharts.js';
import '../../../assets/amchart/serial.js';
import '../../../assets/amchart/light.js';
import { c } from '@angular/core/src/render3';



@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {

    checktoken = () => {
        if (!localStorage.getItem("token")) {
            this.router.navigate(['/login']);
        }
    }

    constructor(public router: Router, private service: ApiService) { }

    makechart = (dataset) => {
        setTimeout(() => {
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
            function makeSeries(name, fieldName) {
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
        }, 100);
    }

    detectiongraph() {
        let detectiongraphdata = [];
        let dataset = [];
        this.service.detectiongraph(localStorage.getItem('customer_code')).subscribe({
            next: (res) => {
                console.log('영스으으응', res)
                detectiongraphdata.push(res)
                const { Button, Scream, Time } = detectiongraphdata[0];
                for (let i = 0; i < Button.length; i++) {
                    dataset.push({ Button: Button[i], Scream: Scream[i], Time: Time[i] })
                }
                this.makechart(dataset)
            },
            error: (err) => {

            },
            complete: () => {
            }
        });
    }

    detectionstatusdata = [];
    detectionstatus() {
        this.service.detectionstatus(localStorage.getItem('customer_code')).subscribe({
            next: (res) => {
                this.detectionstatusdata.push(res)
            },
            error: (err) => {

            },
            complete: () => {
            }
        });
    }

    numdevice;
    deactivatedevice;
    inspectiondevice;
    activatedevice;
    alldevice() {
        this.service.alldevice(localStorage.getItem('customer_code')).subscribe({
            next: (res) => {
                this.numdevice = res.numDevice
                this.deactivatedevice = res.deactivateDevice
                this.inspectiondevice = res.inspectionDevice
                this.activatedevice = (this.numdevice - this.deactivatedevice - this.inspectiondevice)
            },
            error: (err) => {

            },
            complete: () => {
            }
        });
    }

    alivecheckdata = [];
    alivecheckdatakey = [];
    alivecheckdatavalue = [];
    tempdata = [];
    alivecheck() {
        this.service.alivecheck(localStorage.getItem('customer_code')).subscribe({
            next: (res) => {
                this.alivecheckdatakey = Object.keys(res);
                this.alivecheckdatavalue = Object.values(res);
                for (let i = 0; i < this.alivecheckdatakey.length; i++) {
                    this.tempdata.push(this.alivecheckdatakey[i])
                    this.tempdata.push(this.alivecheckdatavalue[i])
                    this.alivecheckdata.push(this.tempdata);
                    this.tempdata = [];
                }
            },
            error: (err) => {
            },
            complete: () => {
            }
        });
    }


    alldetectiondata = [];
    alldetection() {
        this.service.alldetection(localStorage.getItem('customer_code')).subscribe({
            next: (res) => {
                this.alldetectiondata.push(res)
            },
            error: (err) => {

            },
            complete: () => {
            }
        });
    }

    ngOnInit() {
        this.checktoken()
        this.detectiongraph()
        this.detectionstatus()
        this.alldevice()
        this.alivecheck()
        this.alldetection()



    }
}








