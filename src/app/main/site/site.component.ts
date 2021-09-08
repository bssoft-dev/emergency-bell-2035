import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../../auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {

  sites = [];
  site = {};
  userId = '';
  constructor(public db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(auth =>{
      console.log("auth : ");
      console.log(auth);
      this.userId = auth.uid;
      db.list('sites/'+this.userId).snapshotChanges()
      .subscribe(val => {
        console.log(val);
        if(val.length > 0){
          this.sites = [];
          val.forEach((site) => {
            
            let data = site.payload.val();
            console.log(site);
            console.log(data);
            if(data['userId'] == this.userId){
              data['id'] = site.key;
              this.sites.push(data);
            }
            
          })
        }
        console.log(this.sites);
      });
    });

   }

  ngOnInit() {
  }

  selectSite(site){
    site.userId = this.userId;
    this.site = site;
  }
  
  removeSite(site){
    this.db.list('sites/'+this.userId).remove(site.id);
    this.sites.splice(this.sites.indexOf(site),1);
  }
  updateSiteInfo(){
    console.log(this.site);
    console.log(this.userId);
    if(this.site['id']){
      console.log("site update");
      this.db.list('sites/'+this.userId).update(this.site['id'], this.site);
    }
  }

  addSiteInfo(){
    this.site['userId'] = this.userId;
    console.log(this.site);
    console.log(this.userId);
     console.log("site added");
    this.db.list('sites/'+this.userId).push(this.site);
  }
  
  
  newSiteModal(){
    this.site = {};
  }


}
