import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  user;

  constructor() {}

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

  googleLogin() {
    //return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
}
