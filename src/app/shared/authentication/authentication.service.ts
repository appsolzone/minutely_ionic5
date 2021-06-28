import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
// firebase
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from 'firebase/app';
import { environment } from '../../../environments/environment';
// Add the Firebase services that you want to use
// import "firebase/auth";
// import "firebase/firestore";
// import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // firebase.initializeApp(environment.firebaseConfig);
  public firebase = firebase;

  public frb = firebase; // .initializeApp(environment.firebaseConfig,'admin');
  public auth = firebase.auth();
  public db = firebase.firestore();
  // public storage = firebase.storage();
  // // Initialize the FirebaseUI Widget using Firebase.
  // public adminFrb: any = firebase.initializeApp(environment.firebaseConfig);
  public signinUi: any;
  public userData: any;

  constructor(
    private ngFireAuth: AngularFireAuth,
    public dbs: DatabaseService,
  ) {
      this.signinUi = new firebaseui.auth.AuthUI(this.frb.auth());

  }
  authState(callback: any){
    return this.ngFireAuth.authState.subscribe(user => {
      const data = {userData: null, signinUi: null};
      if (user) {
        // console.log("Valid user token, User data", user);
        // this.userData = user;
        data.userData = user;
        // localStorage.setItem('user', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('user'));
      } else {
        // localStorage.setItem('user', null);
        // JSON.parse(localStorage.getItem('user'));
        // this.userData = null;
        data.signinUi = this.signinUi;
        // console.log("No user data", data.signinUi);
      }
      if (callback){
        // If there is a call back function provided, call it at the end
        callback(data);
      }

    });
  }

  signOut(){
    return this.auth.signOut();
  }
}
