import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../../auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {

  devices = [];
  device = {};
  userId = '';
  sites = {};
  siteId;
  siteList = [];
  constructor(public db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(auth =>{
      console.log("auth : ");
      console.log(auth);
      this.userId = auth.uid;
      db.list('devices').snapshotChanges()
      .subscribe(val => {
        console.log(val);
        if(val.length > 0){
          this.devices = [];
          val.forEach((device) => {
            
            let data = device.payload.val();
            console.log(data);
            if(data['userId'] == this.userId){
              this.devices.push(data);
            }
          })
        }
        console.log(this.devices);
      });

      db.list('sites/'+this.userId).snapshotChanges()
      .subscribe(val => {
        console.log(val);
        if(val.length > 0){
          this.sites = {};
          this.siteList = [];
          val.forEach((site) => {
            
            let data = site.payload.val();
            console.log(site);
            console.log(data);
            if(data['userId'] == this.userId){
              data['id'] = site.key;
              this.sites[data['id']] = data;
              this.siteList.push(data);
            }
          })
          console.log(this.sites);
        }
      });

    });

   }

  ngOnInit() {
  }

  updateDeviceInfo(device){
    console.log(this.siteId);
    this.db.list('devices/').update(device.id,{
      siteId : this.siteId
    });
  }

  deleteDevice(device){
    this.db.list('devices/'+device.id).remove('userId');
    this.db.list('devices/'+device.id).remove('name');
    this.db.list('devices/'+device.id).remove('siteId');
  }

}
