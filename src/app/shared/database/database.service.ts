import { Injectable } from '@angular/core';
// firebase
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from "firebase/app";
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { TextsearchService } from '../textsearch/textsearch.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public frb: any = firebase;
  public allCollections = {
    users: 'users',
    subscribers: 'subscribers',
    plans: 'subscriptionOptions',
    notifications: 'notifications',
    useruids:'useruids',
    cart:'cart',
    transactions:'transactions',
    coupons:"coupons",
    latestAlert:"latestAlerts",
    meeting:'meetings',
    risk:'risks',
    task:'tasks',
    issue:'issues',
    kpi:'kpi',
    comment:'comments'
  };
  // Admin instance of firebase to create new users, this is to avoid messing up the
  // auth token post user creation for the .currentUser data
  public adminFrb: any = firebase.initializeApp(environment.firebaseConfig,"admin");
  constructor(
    public afs: AngularFirestore,
    public txtsearch: TextsearchService,
  ) {
    // TBA
  }
  // create
  addDocument(collection:string, docObject:any){
    return this.afs.collection(collection).add(docObject);
  }
  generateDocuemnetRef(collection:string){
    return this.afs.collection(collection).doc();
  }
  // Read
  getDocumentById(collection:string, id:string){
    return this.afs.collection(collection).doc(id).ref.get();
  }
  getAllDocuments(collection:string){
    return this.afs.collection(collection).ref.get();
  }
  getAllDocumentsByQuery(collection:string, queryObj:any[]=[], textSearchObj: any = null, limit:number = null){
    return this.afs.collection(collection,
                             ref=>this.buildQuery(ref,queryObj, textSearchObj, limit)
                           )
                  .get()
                  .toPromise();
  }
  // read and watch
  getDocumentSnapshotById(collection:string, id:string){
    return this.afs.collection(collection).doc(id).snapshotChanges();
  }
  getAllDocumentsSnapshot(collection:string){
    return this.afs.collection(collection).snapshotChanges();
  }
  getAllDocumentsSnapshotByQuery(collection:string, queryObj:any[]=[], textSearchObj: any = null){
    return this.afs.collection(collection,
                               ref=>this.buildQuery(ref,queryObj, textSearchObj)
                             )
                    .snapshotChanges();
  }
  buildQuery(ref,queryObj:any[]=[], textSearchObj: any = null, limit: number = null){
    queryObj.forEach(q=>{ref=ref.where(q.field,q.operator,q.value);});
    if(textSearchObj){
      // now build additional query elements using textsearch
      const { seachField, text, searchOption } = textSearchObj;
      ref = this.txtsearch.getSearchMapQuery(ref, seachField, text, searchOption);
    }
    if(limit){
      ref = ref.limit(limit);
    }
    return ref;
  }
  // Update
  setDocument(collection:string, id:string, docObject:any, merge:boolean=false){
    return this.afs.collection(collection).doc(id).set(docObject,{merge: merge});
  }
  updateDocument(collection:string, id:string, docObject:any){
    return this.afs.collection(collection).doc(id).update(docObject);
  }
  // Delete
  deleteDocument(collection:string, id:string){
    return this.afs.collection(collection).doc(id).delete();
  }
  // Delete subcollections
  deleteSubcollectionDocument(collection:string,docid:string,subcollections:string, subDocid:string){
    return this.afs.collection(collection).doc(docid).collection(subcollections).doc(subDocid).delete();
  }
  // transaction and batch
  setTransactDocument(transRef:any, docRef: any, docObject:any, merge:boolean=false){
    return transRef.set(docRef, docObject,{merge: merge});
  }
  updateTransactDocument(transRef:any, docRef: any, docObject:any){
    return transRef.update(docRef, docObject);
  }
  deleteTransactDocument(transRef:any, docRef: any){
    return transRef.delete(docRef);
  }

  getServerTime(uid){
    var sessionsRef = this.frb.database().ref("sessions/"+uid);
    return sessionsRef.set({
      serverTime: this.frb.database.ServerValue.TIMESTAMP
    }).then(function() {
     return sessionsRef.once("value");
    })
    .then(function(snapshot) {
      var data = snapshot.val();
      return data;
    });
  }

  SendAdminAuthVerificationMail() {
    return this.adminFrb.auth().currentUser.sendEmailVerification()
    .then(() => {
      return true;
    }).catch(()=>{
      return false;
    });
  }
}
