import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../../auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  
  userData = {};
  newDevices = [];
  devices = [];
  newDevice = {};
  sites = [];
  userId;
  constructor(public db: AngularFireDatabase, afAuth:AngularFireAuth) {
    afAuth.authState.subscribe(auth =>{
      console.log("auth : ");
      console.log(auth);
      //this.userData = auth.providerData[0];
      console.log("userData:");
      //this.userData.id = auth.uid;
      this.userId = auth.uid;
      db.list('users/').valueChanges().subscribe(val => {
        if(val.length > 0){
          val.forEach((user) => {
            if(user['id'] == auth.uid){
              this.userData = user;  
            }
          })
        } else {
          this.userData['id'] = auth.uid;
          this.userData['name'] = auth.providerData[0].displayName;
          this.userData['email'] = auth.providerData[0].email;
          this.userData['phone'] = auth.providerData[0].phoneNumber;
          this.userData['photo'] = auth.providerData[0].photoURL;
        }
        console.log(this.userData);

        
        db.list('sites/'+this.userData['id']).snapshotChanges().subscribe(val => {
          console.log(val);
          if(val.length > 0){
            this.sites = [];
            val.forEach((site) => {
              let data = site.payload.val();
              if(data['userId'] == this.userData['id']){
                data['id'] = site.key;
                this.sites.push(data);
              }
            })
            console.log(this.sites);            
          }
        })


      })


    })
    
    db.list('devices').valueChanges().subscribe(val => {
      console.log("new Devices");
      console.log(val)
      if(val.length > 0){
        this.newDevices = [];
        val.forEach((device) => {
          if(device['status'] == 0){
            if(!device['userId']){
              this.newDevices.push(device)
            } else if(this.userId == device['userId']){
              this.devices.push(device);
            }
          }
        })
      }
    });

    
  }

  ngOnInit() {
  }

  updateUserData(){
    console.log(this.userData);
    this.db.list('users/').update(this.userData['id'], this.userData);
  }

  selectDevice(device){
    this.newDevice = device;
  }

  addDevice(){
    this.db.list('devices').update(this.newDevice['id'], {
      userId : this.userData['id'],
      name: this.newDevice['name'],
      siteId : this.newDevice['siteId'],
      status : 'online'
    });
  }
}
