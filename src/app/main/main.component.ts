import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public db: AngularFireDatabase) {
    
    let count = 0;

    const ref = db.object('/logs/').snapshotChanges();
    ref.subscribe((snapshot) => {
        count++;
      console.log('added:', snapshot);
    });

   }

  ngOnInit() {
  }

}
