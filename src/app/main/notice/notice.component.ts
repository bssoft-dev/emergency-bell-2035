import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../../auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {

  userId;
  devices = {};
  deviceList = [];
  sites = {};
  siteList = [];
  
  noticeList = [];

  isUpdated = 0;

  constructor( public db: AngularFireDatabase, public afAuth: AngularFireAuth ) {
    
    afAuth.authState.subscribe(auth =>{
      this.userId = auth.uid;

      
      
      db.list('devices').snapshotChanges()
      .subscribe(val => {
        if(val.length > 0){
          this.devices = {};
          this.deviceList = [];
          this.noticeList = [];
          this.isUpdated = 0;

          val.forEach((device) => {
            let data = device.payload.val();

            if(data['userId'] == this.userId){

              this.devices[data['id']] = data;
              this.isUpdated += 1;
              this.deviceList.push(data);
              /* this.db.list('logs/'+data['id'], ref => ref.orderByChild('datetime')).snapshotChanges().subscribe(val => {
                if(this.isUpdated > 0){
                  if(val.length > 0){
                    
                    val.forEach((log) => {
                      let data = log.payload.val();
                      data['id'] = log.key;
                      this.noticeList.push(data);
                      this.noticeList.sort(
                        function(a, b) {
                          let date1 = new Date(a.datetime);
                          let date2 = new Date(b.datetime);
                          return date1>date2 ? -1 : date1<date2 ? 1 : 0;
                        }
                      )
                    })
                  }
                  console.log(this.noticeList);
                }
                this.isUpdated -= 1;
              }); */
              
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
          this.noticeList = [];
          this.deviceList.forEach(device => {
            console.log(device)
            db.list('detections/'+device.id).snapshotChanges().subscribe(val=>{
              console.log("detections");
              const tempval = val.slice();
              
              tempval.reverse().forEach(data => {
                const detection = data.payload.val();
                const notice = detection;
                notice['id'] = data.key;
                if(notice['result']['event'] != 'speech' && notice['result']['event'] != 'normal' && notice['result']['event'] != '0' && notice['result']['event'] != 'failed')
                this.noticeList.push(notice);
                this.noticeList.sort(function (a,b){
                  let date1 = new Date(a.datetime);
                  let date2 = new Date(b.datetime);
                  return date1>date2 ? -1 : date1<date2 ? 1 : 0;
              });
              });
            })

            db.list('logs/'+device.id).snapshotChanges().subscribe(val=>{
              console.log("logs");
              const tempval = val.slice();
              tempval.reverse().forEach(data => {
                const log = data.payload.val();
                const notice = log;
                notice['id'] = data.key;
                if(notice['event'] != null){
                  this.noticeList.push(notice);
                  this.noticeList.sort(function (a,b){
                    let date1 = new Date(a.datetime);
                    let date2 = new Date(b.datetime);
                    return date1>date2 ? -1 : date1<date2 ? 1 : 0;
                });
                }
                
              });
            })
          })
         
          
        }
      });
              
      
    })
      
  }
  
  ngOnInit() {
  }

  removeNotice(notice){
    console.log("remove notice");
    let devicePath:string = 'devices/'+notice['deviceid']+"/";
    let datetime:string = new Date().toLocaleString('ko-KR');
    
    this.db.list("/").update(devicePath,{
      'lastUpdated' : datetime
    });

    this.db.list('detections/'+notice.deviceid).remove(notice.id);
  }
  detail(notice){
    console.log(notice);
    this.doCheck(notice);
  }

  doCheck(notice){

    let logPath:string = 'detections/'+notice['deviceid'] + "/" + notice['id'] + "/";
    let devicePath:string = 'devices/'+notice['deviceid']+"/";
    let datetime:string = new Date().toLocaleString('ko-KR');
    this.db.list("/").update(logPath,{
      'status' : "check",
      'checkTime' : datetime
    });
    this.db.list("/").update(devicePath,{
      'lastUpdated' : datetime
    });
  }

  doInspection(notice){
    let logPath:string = 'detections/'+notice['deviceid'] + "/" + notice['id'] + "/";
    let devicePath:string = 'devices/'+notice['deviceid']+"/";
    let datetime:string = new Date().toLocaleString('ko-KR');
    this.db.list("/").update(logPath,{
      'status' : "inspection",
      'inspectionTime' : datetime
    });
    this.db.list("/").update(devicePath,{
      'lastUpdated' : datetime
    });
  }

  doReport(notice){
    let logPath:string = 'detections/'+notice['deviceid'] + "/" + notice['id'] + "/";
    let devicePath:string = 'devices/'+notice['deviceid']+"/";
    let datetime:string = new Date().toLocaleString('ko-KR');
    this.db.list("/").update(logPath,{
      'status' : "reported",
      'reportTime' : datetime
    });
    this.db.list("/").update(devicePath,{
      'lastUpdated' : datetime
    });
  }

  doFalseAlarm(notice){
    let logPath:string = 'detections/'+notice['deviceid'] + "/" + notice['id'] + "/";
    let devicePath:string = 'devices/'+notice['deviceid']+"/";
    let datetime:string = new Date().toLocaleString('ko-KR');
    this.db.list("/").update(logPath,{
      'status' : "falseAlarm",
      'falseAlarmTime' : datetime
    });
    this.db.list("/").update(devicePath,{
      'lastUpdated' : datetime
    });
  }

}
