import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public db: AngularFireDatabase, public router: Router) {
    
    let count = 0;

    const ref = db.object('/logs/').snapshotChanges();
    ref.subscribe((snapshot) => {
        count++;
      console.log('added:', snapshot);
    });

   }

  ngOnInit() {}

  logout(){
    console.log('안녕하세요')
    localStorage.removeItem("token")
    this.router.navigate(['/login'])
  }
}
