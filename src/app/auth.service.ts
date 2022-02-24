import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthService {

  user;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase) {
      
      afAuth.authState.subscribe((user) =>{
        console.log('[authservice] user change');
        console.log(user);
        this.user = user;
      })
     }

  public isAuthenticated(): boolean {
    return this.user !== null;
  }

  get currentUser(): any {
    return this.isAuthenticated ? this.user.auth : null;
  }
  
  // Returns current user UID
  get currentUserId(): string {
    return this.isAuthenticated ? this.user.uid : '';
  }

  private updateUserData(): void {

    let path = `users/${this.currentUserId}`; // Endpoint on firebase
    let data = {
                 name: this.currentUser.displayName,
                 email: this.currentUser.email,
               }
  
    this.db.object(path).update(data)
    .catch(error => console.log(error));
  
  }

  googleLogin() {
    //return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginWithEmail(email, password){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  addUser(credential){
    return this.afAuth.auth.createUserWithEmailAndPassword(credential.email, credential.password);
  }
}
