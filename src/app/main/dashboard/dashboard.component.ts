import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../../auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

import * as mapboxgl from 'mapbox-gl';


declare var WaveSurfer;
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

    
  
    
    
    screamhsla = 'hsla(5, 100%, 50%, 0.5)'
    sliphsla = 'hsla(150, 100%, 30%, 0.5)'
    helphsla = 'hsla(80, 100%, 30%, 0.5)'
    violenthsla = 'hsla(300, 100%, 30%, 0.5)'

    // 소리 정보
    annotations = [
        {name: '낙상', start: 0,end: 5,loop: false,color: this.screamhsla ,comment: '출동완료'},
        {name: '비명',start: 6,end: 10,loop: false,color: this.sliphsla,comment: '출동완료'},
        {name: '도움요청',start: 12,end: 15,loop: false,color: this.helphsla,comment: '확인중'},
        {name: '비명',start: 16,end: 20,loop: false,color: this.violenthsla,comment: '출동완료'},
        {name: '비명',start: 32,end: 38,loop: false,color: this.screamhsla,comment: '출동완료'},
        {name: '비명',start: 50,end: 60,loop: false,color: this.sliphsla,comment: '출동완료'},
    ];
    
  
    
  siteid = 'ttat1120';
  sitename = 'TTA 테스트지역';
  sitecase = 'SCREAM';
  date = new Date();

  wavetext = "";


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



  constructor(public db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    
    
    afAuth.authState.subscribe(auth =>{

        console.log("auth : ");
        console.log(auth);
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
                  
                  console.log(this.noticeList);
                });

                this.db.list('logs/'+data['id']).snapshotChanges().subscribe(val => {
                    if(val.length > 0){
                      
                      val.forEach((log) => {
                        let data = log.payload.val();
                        console.log(data)
                        console.log(this.noticeList)
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
                    
                    console.log(this.noticeList);
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
                    // center: [this.siteList[0].locationLon, this.siteList[0].locationLat],
                    center: [126.849516, 35.222406],
                    zoom: 15
                });

                this.siteList.forEach(site => {
                    //console.log("new makrer");
                    //console.log(site);
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
                    //console.log(this.NoBellsSite[device['siteId']]);
                    if(this.NoBellsSite[device['siteId']]){
                        this.NoBellsSite[device['siteId']] += 1;
                    } else {
                        this.NoBellsSite[device['siteId']] = 1;
                    }
                    //console.log(this.NoBellsSite[device['siteId']]);
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
                                    console.log(event)
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

                        console.log(this.logs);
                        console.log(this.noticeList);
                        this.caseList.sort(function (a,b){
                            return a.datetime > b.datetime ? -1 : a.datetime < b.datetime ? 1 : 0;
                        });
                        this.caseList = this.caseList.splice(0,3);
                        console.log(this.caseList);

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

                       /*  this.detectedCaseChart.data.dataset = [
                            this.casePercent.reported,
                            this.casePercent.detected,
                            this.casePercent["false alarm"]
                        ]
                        this.detectedCaseChart.update();
                        console.log("detectedCaseChart dataset");
                        console.log(this.detectedCaseChart.data.dataset); */

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
                                    console.log(event['result']['event'])
                                    this.casePercent.detected += 1;
                                    this.logs.push(event);
                                }

                            })
                            this.isUpdated -= 1;
                            
                        }

                        this.logs.sort(function (a,b){
                            return a.datetime > b.datetime ? -1 : a.datetime < b.datetime ? 1 : 0;
                        });

                        console.log(this.logs);
                        console.log(this.noticeList);
                        this.caseList.sort(function (a,b){
                            return a.datetime > b.datetime ? -1 : a.datetime < b.datetime ? 1 : 0;
                        });
                        this.caseList = this.caseList.splice(0,3);
                        console.log(this.caseList);

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

               

        //let monthDate = new Date().getTime()-(1000 * 60 * 60 * 24 * 30);
        //monthDate:Date = monthDate.toLocaleString("ko-KR");

        /* db.list('devices/', ref=> ref.orderByChild('lastUpdated').startAt(monthDate)).snapshotChanges().subscribe(val => {
            console.log("month bells");
            console.log(new Date(monthDate).toLocaleString());
            console.log(new Date(val.toString()));
        }); */


    });
   
}
    

    
    ngOnInit() {

        

        this.wavesurfer = WaveSurfer.create({
            container: document.querySelector('#waveform'),
            waveColor: '#00ff00',
            progressColor: '#4353FF',
            cursorColor: '#4353FF',
            barWidth: 3,
            barRadius: 3,
            cursorWidth: 1,
            height: 200,
            barGap: 3,
            backend: 'MediaElement',
            /* plugins: [
                WaveSurfer.regions.create({
                    regionsMinLength: 2,
                    regions: this.annotations
                        // [
                        //     {   
                        //         id: 'myid',
                        //         start: 10,
                        //         end: 23,
                        //         loop: false,
                        //         color: 'hsla(400, 100%, 30%, 0.5)'
                        //     }, {
                        //         start: 5,
                        //         end: 7,
                        //         loop: false,
                        //         color: 'hsla(200, 50%, 70%, 0.4)',
                        //         minLength: 1,
                        //     }
                        // ]
                    ,
                    dragSelection: {
                        slop: 5
                    }
                }),
                ], */
            }); 
            

        
        this.wavesurfer.stop();

           

    }
    
    
    regionPlay(){
        
        
    }

    // play/pause 버튼 클릭
    playPause(log){
        console.log(log)
        if(log != null){
            if(log.soundurl != null && this.wavesurfer != null){
                this.wavesurfer.load(log.soundurl);
                this.wavesurfer.playPause();
            }
            this.wavetext = log.result.text;
        } else {
            this.wavesurfer.playPause();
        }
        
        //this.wavesurfer.play(10,20);
        // this.wavesurfer.addRegion({  
        //     id: 'myid',
        //     start: 10,
        //     end: 23,
        //     loop: true,
        //     color: 'hsla(400, 100%, 30%, 0.5)'
        // });
    }
    
    
    
    playPauseann(value){
        var start = value;
        this.wavesurfer.play(start);
    }

    playregion(){
        this.wavesurfer.on('region-click', function(region, e) {
            console.log(region.start);
            console.log(region.end);
            e.stopPropagation();
            this.wavesurfer.play(region.start, region.end);
        });
    }
    
    

    chartChange(type){

        
        if(this.chartType == type){
            this.chartType = 0;
        } else {
            this.chartType = type;
        }

        var labels = [];
        var color = Chart.helpers.color;
        var datas = [];
        this.siteList.forEach(site =>{
            labels.push(site['name']);
            
            let no = 0;
            if(this.NoBellsSite[site['id']]){
                no = this.NoBellsSite[site['id']];
            }
            console.log(no);
            datas.push(no);
        });
        var datasets = [
            {
                label: 'Number of Bells',
                borderColor: 'red',
                backgroundColor: 'orange',
                data: datas
            }
        ];

        var data = {
            labels: labels,
            datasets: datasets
        };

        var options = {
            responsive: true,
            legend: {
                position: 'top',
            }
        };

        
        setTimeout(() => {
            if(this.chartType == 1){
                var chart = new Chart('bells', {
                    type: 'bar',
                    data: data,
                    options: options
                }); 

            } else if(this.chartType ==2){
                let dataProvider = []
                this.logs.sort(function (a,b){
                    return a.datetime < b.datetime ? -1 : a.datetime > b.datetime ? 1 : 0;
                });
                let scream = 0;
                let button = 0;
                
                this.logs.forEach(log => {
                    if(log['event'] == 'SCREAM'){
                        scream += 1;
                    } else if(log['event'] == 'BUTTON'){
                        button += 1;
                    }
                    let datetime = new Date(log['datetime']);
                    dataProvider.push(
                        {
                            'date': datetime,
                            'scream': scream,
                            'button': button
                        }
                    )
                })

                

                console.log(dataProvider);
                var eventChart = AmCharts.makeChart('events', {
                    'type': 'serial',
                    'hideCredits': true,
                    'theme': 'light',
                    'dataDateFormat': 'MM/DD/YYYY HH:NN:SS A',
                    'precision': 2,
                    'valueAxes': [{
                      "stackType": "regular",
                      'id': 'v1',
                      'title': 'Number of Events',
                      'position': 'left',
                      'autoGridCount': false,
                      /* 'labelFunction': function (value) {
                        return '' + Math.round(value) + '';
                      } */
                    }],
                    'graphs': [{
                      "fillAlphas": 0.5,
                      "lineAlpha": 0.5,
                      'id': 'scream',
                      'valueAxis': 'v2',
                      'bullet': 'round',
                      'bulletBorderAlpha': 1,
                      'bulletColor': '#FFFFFF',
                      'bulletSize': 5,
                      'hideBulletsCount': 50,
                      'lineThickness': 2,
                      'lineColor': '#448aff',/* 
                      'type': 'smoothedLine', */
                      'title': 'SCREAM',
                      'useLineColorForBulletBorder': true,
                      'valueField': 'scream',
                      'balloonText': '[[title]]<br /><b style="font-size: 130%">[[value]]</b>'
                    }, {
                      "fillAlphas": 0.5,
                      "lineAlpha": 0.5,
                      'id': 'button',
                      'valueAxis': 'v2',
                      'bullet': 'round',
                      'bulletBorderAlpha': 1,
                      'bulletColor': '#FFFFFF',
                      'bulletSize': 5,
                      'hideBulletsCount': 50,
                      'lineThickness': 2,
                      'lineColor': '#536dfe',/* 
                      'type': 'smoothedLine', */
                      'title': 'BUTTON',
                      'useLineColorForBulletBorder': true,
                      'valueField': 'button',
                      'balloonText': '[[title]]<br /><b style="font-size: 130%">[[value]]</b>'
                    }],
                    'chartCursor': {
                      'pan': true,
                      'valueLineEnabled': true,
                      'valueLineBalloonEnabled': true,
                      'cursorAlpha': 0,
                      'valueLineAlpha': 0.2
                    },
                    'categoryField': 'date',
                    'categoryAxis': {
                      'minPeriod': 'ss',
                      'parseDates': true,
                      'dashLength': 1,
                      'minorGridEnabled': true
                    },
                    'legend': {
                      'useGraphSettings': true,
                      'position': 'top'
                    },
                    'balloon': {
                      'borderThickness': 1,
                      'shadowAlpha': 0
                    },
                    'export': {
                      'enabled': true
                    },
                    'dataProvider': dataProvider
                  });
            } else if(this.chartType ==3){
                mapboxgl.accessToken = 'pk.eyJ1IjoiYnVtc3VramFuZyIsImEiOiJjam93YjBmenAxZ3pzM3NwamwycGF2amFxIn0.f6yryjJn1NMUzgjWxdquNQ';
                var map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v9',
                    // center: [this.siteList[0].locationLon, this.siteList[0].locationLat],
                    center: [126.849516, 35.222406],
                    zoom: 15
                });

                this.siteList.forEach(site => {
                    //console.log("new makrer");
                    //console.log(site);
                    map.flyTo({center: [site.locationLon, site.locationLat]});
                    
                    
                    new mapboxgl.Marker()
                        .setLngLat([site.locationLon, site.locationLat])
                        .addTo(map);
                })

            } else if(this.chartType ==4){

            }
        }, 100);
        
    
    }

    playlist = ['1','2'];
    
    

    
}


