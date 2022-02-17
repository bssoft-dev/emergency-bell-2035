import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
declare const am5: any;
declare const am5xy: any;
declare const am5themes_Animated: any;
import * as mapboxgl from 'mapbox-gl';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';


declare const AmCharts: any;
declare let i: 0;


import '../../../assets/amchart/amcharts.js';
import '../../../assets/amchart/serial.js';
import '../../../assets/amchart/light.js';
import { RegisterComponent } from '../../register/register.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {


    siteid = 'ttat1120';
    sitename = 'TTA 테스트지역';
    sitecase = 'SCREAM';
    date = new Date();

    chartType = 0;

    userId;

    NoBells = 0;
    NoBellsMonth = 0;
    NoBellsSite = {};
    NoEvents = 0;
    NoEventsMonth = 0; 

    NoInstallation = 0;
    NoInstallationMonth = 0;

    NoCases = 0;
    NoCasesMonth = 0;

    casePercent = {
        "reported" : 0,
        "detected" : 0,
        "false alarm" : 0
    };

    caseList = [];

    siteList = [];
    siteIdList = [];
    deviceList = [];

    isUpdated = 0;

    detectedCaseChart;

    logs = [];

    devices = {};
    sites = {};
    
    detectionList = [];
    logList = [];

    noticeList = [];
    wavesurfer;

    checktoken = ()=>{
        if(!localStorage.getItem("token")){
            this.router.navigate(['/login']);
        }
    }

    makechart = ()=>{
        setTimeout(() => {
            var root = am5.Root.new("chartdiv");

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout
        }));

        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/

        var data = [{
        "time": "2021",
        "button": 2.1,
        "scream": 0.4,
        }, {
        "time": "2022",
        "button": 2.2,
        "scream": 0.3
        }, {
        "time": "2023",
        "button": 2.4,
        "scream": 0.5
        },{
        "time": "2024",
        "button": 2.4,
        "scream": 0.5
        },{
        "time": "2025",
        "button": 2.4,
        "scream": 0.5
        }]


        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "time",
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
        }));

        xAxis.data.setAll(data);

        
        

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        numberFormat: "#'%'",
        strictMinMax: true,
        calculateTotals: true,
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
            if(name==="Button"){
                var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    fill: am5.color("#6794dc"),
                    name: name,
                    stacked: true,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: fieldName,
                    valueYShow: "valueYTotalPercent",
                    categoryXField: "time"
                }));
            }else{
                var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    fill: am5.color("#a367dc"),
                    name: name,
                    stacked: true,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: fieldName,
                    valueYShow: "valueYTotalPercent",
                    categoryXField: "time"
                }));
            }
            series.columns.template.setAll({
                tooltipText: "{name}, {categoryX}:{valueYTotalPercent.formatNumber('#.#')}%",
                tooltipY: am5.percent(10),
                
            });
            series.data.setAll(data);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear();

            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                sprite: am5.Label.new(root, {
                    text: "{valueYTotalPercent.formatNumber('#.#')}%",
                    fill: root.interfaceColors.get("alternativeText"),
                    centerY: am5.p50,
                    centerX: am5.p50,
                    populateText: true
                })
                });
            });
            legend.data.push(series);
        }


        makeSeries("Button", "button");
        makeSeries("Scream", "scream");

        xAxis.get("renderer").labels.template.setAll({
            fill: root.interfaceColors.get("alternativeText")
        });
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        }, 100);
    }

    constructor(public db: AngularFireDatabase, public afAuth: AngularFireAuth, public router: Router, private service:ApiService) {
        afAuth.authState.subscribe(auth =>{
            this.userId = auth.uid;
            this.userId = auth.uid;

            db.list('devices').snapshotChanges()
            .subscribe(val => {
            if(val.length > 0){
                this.devices = {};
                this.deviceList = [];
                this.noticeList = [];
                val.forEach((device) => {
                let data = device.payload.val();
    
                if(data['userId'] == this.userId){
    
                    this.devices[data['id']] = data;
                    this.db.list('detections/'+data['id']).snapshotChanges().subscribe(val => {
                    if(val.length > 0){
                        
                        val.forEach((log) => {
                        let data = log.payload.val();
                        data['id'] = log.key;
                        if(data['result']['event'] != 'speech' && data['result']['event'] != 'normal' && data['result']['event'] != 'failed'){
                            if(this.noticeList.find(element => element['id'] == data['id']) == null){
                                this.noticeList.push(data);

                                this.noticeList.sort(
                                    function(a, b) {
                                    let date1 = new Date(a.datetime);
                                    let date2 = new Date(b.datetime);
                                    return date1>date2 ? -1 : date1<date2 ? 1 : 0;
                                    }
                                )
                            }
                            
                        }
                        
                        })
                    }
                    
                    });

                    this.db.list('logs/'+data['id']).snapshotChanges().subscribe(val => {
                        if(val.length > 0){
                        
                        val.forEach((log) => {
                            let data = log.payload.val();
        
                            data['id'] = log.key;
                            if(data['deviceid'] != null && data['event'] != 'speech'){
                                if(this.noticeList.find(element => element['id'] == data['id']) == null){
                                    this.noticeList.push(data);
        
                                    this.noticeList.sort(
                                        function(a, b) {
                                        let date1 = new Date(a.datetime);
                                        let date2 = new Date(b.datetime);
                                        return date1>date2 ? -1 : date1<date2 ? 1 : 0;
                                        }
                                    )
                                }
                            }
                            
                        })
                        }
                        
                    });
    
                }
                
                });
    
            }
            });
                    
            db.list('sites/'+this.userId).snapshotChanges()
            .subscribe(val => {
            if(val.length > 0){
                this.sites = {};
                this.siteList = [];
                val.forEach((site) => {
                
                let data = site.payload.val();
                if(data['userId'] == this.userId){
                    data['id'] = site.key;
                    this.sites[data['id']] = data;
                    this.siteList.push(data);
                }
                })
            }
            });

            mapboxgl.accessToken = 'pk.eyJ1IjoiYnVtc3VramFuZyIsImEiOiJjam93YjBmenAxZ3pzM3NwamwycGF2amFxIn0.f6yryjJn1NMUzgjWxdquNQ';
                    var map = new mapboxgl.Map({
                        container: 'map',
                        style: 'mapbox://styles/mapbox/streets-v9',

                        center: [126.849516, 35.222406],
                        zoom: 15
                    });

                    this.siteList.forEach(site => {
                        map.flyTo({center: [site.locationLon, site.locationLat]});
                        
                        
                        new mapboxgl.Marker()
                            .setLngLat([site.locationLon, site.locationLat])
                            .addTo(map);
                    })
            
            db.list('sites/'+this.userId).snapshotChanges().subscribe((val) =>{
                this.NoInstallation = val.length;
            })

            db.list('devices/').snapshotChanges().subscribe((val) => {
                this.NoBells = 0;
                this.NoEvents = 0;
                this.casePercent = {
                    "reported" : 0,
                    "detected" : 0,
                    "false alarm" : 0
                };
                this.logs = [];
                this.caseList = [];
                this.NoBellsSite = [];
                val.forEach((data) =>{
                    let device = data.payload.val();
                    if(device['userId'] == this.userId){
                        this.NoBells += 1;
                        this.deviceList.push(device);
                        this.isUpdated += 1;
                        this.NoCases = 0;

                        if(this.NoBellsSite[device['siteId']]){
                            this.NoBellsSite[device['siteId']] += 1;
                        } else {
                            this.NoBellsSite[device['siteId']] = 1;
                        }
            
                        db.list('detections/'+device['id'], ref => ref.orderByKey()).snapshotChanges().subscribe((val) => {
                            
                            if(this.isUpdated > 0){
                                this.NoEvents += val.length;
                                val.forEach((data) =>{
                                    let event = data.payload.val();
                                    
                                    if(event['status'] == "reported"){
                                        this.NoCases += 1;
                                        this.casePercent.reported += 1;
                                        this.caseList.push(event);
                                    } else if(event['status'] == "falseAlarm"){
                                        this.casePercent["false alarm"] += 1;
                                        //this.caseList.push(event);
                                    } else if(event['result']['event'] != 'speech' && event['result']['event'] != '0' && event['result']['event'] != 'failed' && event['result']['event'] != 'normal'){
                        
                                        this.casePercent.detected += 1;
                                    } else {
                                        this.NoEvents -= 1;
                                    }

                                })
                                this.isUpdated -= 1;
                                
                            }

                            this.logs.sort(function (a,b){
                                return a.datetime > b.datetime ? -1 : a.datetime < b.datetime ? 1 : 0;
                            });

                        
                            this.caseList.sort(function (a,b){
                                return a.datetime > b.datetime ? -1 : a.datetime < b.datetime ? 1 : 0;
                            });
                            this.caseList = this.caseList.splice(0,3);
                

                            this.detectedCaseChart = new Chart('detectedCaseDoughnutChart', {
                                type: 'doughnut',
                                data: {
                                labels: ["Reported","Detected","False Alarm"],
                                datasets: [{ 
                                        data: [
                                            this.casePercent.reported,
                                            this.casePercent.detected,
                                            this.casePercent["false alarm"]],
                                        backgroundColor: [
                                            "#00ce68",
                                            "#308ee0",
                                            "#e65251"
                                        ],
                                        borderColor: [
                                            "#00ce68",
                                            "#308ee0",
                                            "#e65251"
                                        ]
                                    }]
                                },
                                options: {
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
                                }
                            });

                    

                        })

                        db.list('logs/'+device['id'], ref => ref.orderByKey()).snapshotChanges().subscribe((val) => {
                            
                            if(this.isUpdated > 0){
                                this.NoEvents += val.length;
                                val.forEach((data) =>{
                                    let event = data.payload.val();
                                    
                                    if(event['status'] == "reported"){
                                        this.NoCases += 1;
                                        this.casePercent.reported += 1;
                                        this.caseList.push(event);
                                        this.logs.push(event);
                                    } else if(event['status'] == "falseAlarm"){
                                        this.casePercent["false alarm"] += 1;
                                        //this.caseList.push(event);
                                        this.logs.push(event);
                                    } else {
            
                                        this.casePercent.detected += 1;
                                        this.logs.push(event);
                                    }

                                })
                                this.isUpdated -= 1;
                                
                            }

                            this.logs.sort(function (a,b){
                                return a.datetime > b.datetime ? -1 : a.datetime < b.datetime ? 1 : 0;
                            });

                        
                            this.caseList.sort(function (a,b){
                                return a.datetime > b.datetime ? -1 : a.datetime < b.datetime ? 1 : 0;
                            });
                            this.caseList = this.caseList.splice(0,3);
                    

                            this.detectedCaseChart = new Chart('detectedCaseDoughnutChart', {
                                type: 'doughnut',
                                data: {
                                labels: ["Reported","Detected","False Alarm"],
                                datasets: [{ 
                                        data: [
                                            this.casePercent.reported,
                                            this.casePercent.detected,
                                            this.casePercent["false alarm"]],
                                        backgroundColor: [
                                            "#00ce68",
                                            "#308ee0",
                                            "#e65251"
                                        ],
                                        borderColor: [
                                            "#00ce68",
                                            "#308ee0",
                                            "#e65251"
                                        ]
                                    }]
                                },
                                options: {
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
                                }
                            });
                        })
                    }
                });
            });

                

        });

    }

    detectiongraph(){
        this.service.detectiongraph(localStorage.getItem('customer_code')).subscribe({
            next:(res) => { 
              
             },
            error:(err)=>{
                
             },
            complete:()=> { 
            }
          });
    }

    detectionstatus(){
        this.service.detectionstatus(localStorage.getItem('customer_code')).subscribe({
            next:(res) => { 

             },
            error:(err)=>{
              
             },
            complete:()=> { 
            }
          });
    }

    alldevice(){
        this.service.alldevice(localStorage.getItem('customer_code')).subscribe({
            next:(res) => { 

             },
            error:(err)=>{
              
             },
            complete:()=> { 
            }
          });
    }

    alivecheck(){
        this.service.alivecheck(localStorage.getItem('customer_code')).subscribe({
            next:(res) => { 
              console.log('1123', res)
             },
            error:(err)=>{
                console.log('11', err)
             },
            complete:()=> {
            }
          });
    }

    alldetection(){
        this.service.alldetection(localStorage.getItem('customer_code')).subscribe({
            next:(res) => { 
              
             },
            error:(err)=>{
                
              
             },
            complete:()=> { 
            }
          });
    }

    ngOnInit() {
        this.checktoken()
        this.makechart()
        this.detectiongraph()
        this.detectionstatus()
        this.alldevice()
        this.alivecheck()
        this.alldetection()
    }
}


    
    

    


